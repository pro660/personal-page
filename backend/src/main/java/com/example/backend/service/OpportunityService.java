package com.example.backend.service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.example.backend.dto.OpportunityResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.MissingNode;

@Service
public class OpportunityService {

    private static final Logger log = LoggerFactory.getLogger(OpportunityService.class);
    private static final String LINKAREER_SCIENCE_CONTEST_URL =
            "https://linkareer.com/list/contest?filterBy_categoryIDs=35"
                    + "&filterType=CATEGORY"
                    + "&orderBy_direction=DESC"
                    + "&orderBy_field=CREATED_AT"
                    + "&page=%d";
    private static final Duration CACHE_TTL = Duration.ofMinutes(10);
    private static final int MAX_PAGES = 25;
    private static final int MAX_ITEMS = 100;
    private static final int PER_SOURCE_LIMIT = 2;
    private static final String SCIENCE_ENGINEERING_CATEGORY = "과학/공학";
    private static final List<OpportunitySource> SOURCES = List.of(
            new OpportunitySource("행정안전부", "공공/정책 공모전", List.of("행정안전부", "행안부")),
            new OpportunitySource("국토교통부", "국토/교통 공모전", List.of("국토교통부", "국토부")),
            new OpportunitySource("관광데이터", "관광 데이터 공모전", List.of("관광데이터", "한국관광공사", "관광공사", "문화체육관광")),
            new OpportunitySource("토스", "핀테크/서비스 챌린지", List.of("토스", "비바리퍼블리카", "toss")),
            new OpportunitySource("네이버", "플랫폼/AI 챌린지", List.of("네이버", "naver")),
            new OpportunitySource("카카오", "플랫폼/관광 공모전", List.of("카카오", "kakao"))
    );

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final Object cacheLock = new Object();
    private volatile CachedOpportunities cache = CachedOpportunities.empty();

    public OpportunityService(RestClient.Builder restClientBuilder, ObjectMapper objectMapper) {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofSeconds(3));
        requestFactory.setReadTimeout(Duration.ofSeconds(5));

        this.restClient = restClientBuilder
                .requestFactory(requestFactory)
                .build();
        this.objectMapper = objectMapper;
    }

    public List<OpportunityResponse> getOpportunities() {
        CachedOpportunities snapshot = cache;

        if (snapshot.isFresh()) {
            return snapshot.items();
        }

        synchronized (cacheLock) {
            snapshot = cache;

            if (snapshot.isFresh()) {
                return snapshot.items();
            }

            List<OpportunityResponse> fetchedItems = fetchLinkareerContests();

            if (!fetchedItems.isEmpty()) {
                cache = new CachedOpportunities(List.copyOf(fetchedItems), Instant.now());
                return cache.items();
            }

            return snapshot.items();
        }
    }

    private List<OpportunityResponse> fetchLinkareerContests() {
        List<OpportunityResponse> responses = new ArrayList<>();
        Set<String> seenUrls = new HashSet<>();
        Map<String, Integer> sourceCounts = new HashMap<>();

        for (int page = 1; page <= MAX_PAGES && responses.size() < MAX_ITEMS; page += 1) {
            try {
                String html = restClient.get()
                        .uri(toLinkareerContestUrl(page))
                        .retrieve()
                        .body(String.class);

                if (html == null || html.isBlank()) {
                    continue;
                }

                JsonNode activities = getApolloState(html);
                if (activities.isMissingNode()) {
                    continue;
                }

                collectOpenActivities(activities, responses, seenUrls, sourceCounts);
            } catch (Exception exception) {
                log.warn("Failed to fetch opportunity detail links from Linkareer page {}", page, exception);
            }
        }

        return responses;
    }

    private void collectOpenActivities(
            JsonNode apolloState,
            List<OpportunityResponse> responses,
            Set<String> seenUrls,
            Map<String, Integer> sourceCounts
    ) {
        apolloState.properties().forEach(entry -> {
            if (responses.size() >= MAX_ITEMS) {
                return;
            }

            if (!entry.getKey().startsWith("Activity:")) {
                return;
            }

            JsonNode activity = entry.getValue();
            String title = cleanTitle(activity.path("title").asText());
            String organization = activity.path("organizationName").asText("");
            String searchableText = title + " " + organization;

            if (searchableText.isBlank()) {
                return;
            }

            OpportunitySource source = findSource(searchableText);
            boolean showAsTrackedSource = source != null
                    && sourceCounts.getOrDefault(source.name(), 0) < PER_SOURCE_LIMIT;

            long recruitCloseAt = activity.path("recruitCloseAt").asLong(0);

            if (isClosed(recruitCloseAt)) {
                return;
            }

            String detailUrl = toLinkareerActivityUrl(entry.getKey());

            if (!seenUrls.add(detailUrl)) {
                return;
            }

            String sourceName = showAsTrackedSource ? source.name() : getOrganizationName(organization);

            responses.add(new OpportunityResponse(
                    title,
                    buildDescription(sourceName, organization, recruitCloseAt),
                    detailUrl,
                    sourceName,
                    SCIENCE_ENGINEERING_CATEGORY,
                    recruitCloseAt > 0 ? Instant.ofEpochMilli(recruitCloseAt).toString() : ""
            ));
            if (showAsTrackedSource) {
                sourceCounts.merge(source.name(), 1, Integer::sum);
            }
        });
    }

    private JsonNode getApolloState(String html) throws java.io.IOException {
        Document document = Jsoup.parse(html);
        String nextData = document.selectFirst("script#__NEXT_DATA__") == null
                ? ""
                : document.selectFirst("script#__NEXT_DATA__").data();

        if (nextData.isBlank()) {
            return MissingNode.getInstance();
        }

        JsonNode pageProps = objectMapper.readTree(nextData)
                .path("props")
                .path("pageProps");

        JsonNode apolloState = pageProps.path("__APOLLO_STATE__");

        if (apolloState.isMissingNode()) {
            return pageProps.path("apolloState");
        }

        return apolloState;
    }

    private String toLinkareerContestUrl(int page) {
        return LINKAREER_SCIENCE_CONTEST_URL.formatted(page);
    }

    private String toLinkareerActivityUrl(String activityKey) {
        return "https://linkareer.com/activity/" + activityKey.replace("Activity:", "");
    }

    private String buildDescription(String source, String organization, long recruitCloseAt) {
        String owner = organization == null || organization.isBlank() ? source : organization;
        String closeText = recruitCloseAt > 0
                ? "마감 " + Instant.ofEpochMilli(recruitCloseAt)
                : "마감일 확인 필요";

        return owner + " 주최/관련 공모전입니다. " + closeText;
    }

    private String getOrganizationName(String organization) {
        if (organization == null || organization.isBlank()) {
            return "링커리어";
        }

        return organization;
    }

    private boolean isClosed(long recruitCloseAt) {
        return recruitCloseAt > 0 && recruitCloseAt < Instant.now().toEpochMilli();
    }

    private OpportunitySource findSource(String value) {
        String lowerValue = value.toLowerCase();

        return SOURCES.stream()
                .filter(source -> source.aliases().stream()
                        .anyMatch(alias -> lowerValue.contains(alias.toLowerCase())))
                .findFirst()
                .orElse(null);
    }

    private String cleanTitle(String title) {
        return title == null
                ? ""
                : title.replaceFirst("^추천\\s*", "").replaceAll("\\s+", " ").trim();
    }

    private record OpportunitySource(String name, String type, List<String> aliases) {
    }

    private record CachedOpportunities(List<OpportunityResponse> items, Instant cachedAt) {

        private static CachedOpportunities empty() {
            return new CachedOpportunities(List.of(), Instant.EPOCH);
        }

        private boolean isFresh() {
            return !items.isEmpty() && cachedAt.plus(CACHE_TTL).isAfter(Instant.now());
        }
    }
}
