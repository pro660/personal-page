package com.example.backend.service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.example.backend.dto.JobResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class JobService {

    private static final Logger log = LoggerFactory.getLogger(JobService.class);
    private static final String SARAMIN_JOB_SEARCH_PATH = "/job-search";
    private static final String JOB_KEYWORDS = "React Spring Boot Java 프론트엔드 백엔드 웹개발";
    private static final Duration CACHE_TTL = Duration.ofMinutes(10);
    private static final int MAX_ITEMS = 60;

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String accessKey;
    private final Object cacheLock = new Object();
    private volatile CachedJobs cache = CachedJobs.empty();

    public JobService(
            RestClient.Builder restClientBuilder,
            ObjectMapper objectMapper,
            @Value("${saramin.api.access-key:}") String accessKey
    ) {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofSeconds(3));
        requestFactory.setReadTimeout(Duration.ofSeconds(5));

        this.restClient = restClientBuilder
                .baseUrl("https://oapi.saramin.co.kr")
                .requestFactory(requestFactory)
                .build();
        this.objectMapper = objectMapper;
        this.accessKey = accessKey;
    }

    public List<JobResponse> getJobs() {
        CachedJobs snapshot = cache;

        if (snapshot.isFresh()) {
            return snapshot.items();
        }

        synchronized (cacheLock) {
            snapshot = cache;

            if (snapshot.isFresh()) {
                return snapshot.items();
            }

            List<JobResponse> fetchedItems = fetchSaraminJobs();

            if (!fetchedItems.isEmpty()) {
                cache = new CachedJobs(List.copyOf(fetchedItems), Instant.now());
                return cache.items();
            }

            return snapshot.items();
        }
    }

    private List<JobResponse> fetchSaraminJobs() {
        if (accessKey == null || accessKey.isBlank()) {
            log.info("Saramin access key is not configured. Set SARAMIN_ACCESS_KEY to enable job listings.");
            return List.of();
        }

        try {
            String responseBody = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path(SARAMIN_JOB_SEARCH_PATH)
                            .queryParam("access-key", accessKey)
                            .queryParam("keywords", JOB_KEYWORDS)
                            .queryParam("fields", "posting-date,expiration-date,count")
                            .queryParam("start", 0)
                            .queryParam("count", MAX_ITEMS)
                            .queryParam("sort", "pd")
                            .build())
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .body(String.class);

            if (responseBody == null || responseBody.isBlank()) {
                return List.of();
            }

            return parseJobs(objectMapper.readTree(responseBody));
        } catch (Exception exception) {
            log.warn("Failed to fetch job listings from Saramin", exception);
            return List.of();
        }
    }

    private List<JobResponse> parseJobs(JsonNode root) {
        JsonNode jobsNode = root.path("jobs").path("job");

        if (jobsNode.isMissingNode() || jobsNode.isNull()) {
            return List.of();
        }

        List<JobResponse> responses = new ArrayList<>();

        if (jobsNode.isArray()) {
            jobsNode.forEach(job -> addActiveJob(job, responses));
            return responses;
        }

        addActiveJob(jobsNode, responses);
        return responses;
    }

    private void addActiveJob(JsonNode job, List<JobResponse> responses) {
        if (!"1".equals(job.path("active").asText())) {
            return;
        }

        JsonNode position = job.path("position");

        responses.add(new JobResponse(
                job.path("id").asText(""),
                position.path("title").asText(""),
                job.path("company").path("detail").path("name").asText(""),
                job.path("url").asText(""),
                position.path("location").path("name").asText(""),
                position.path("job-type").path("name").asText(""),
                position.path("experience-level").path("name").asText(""),
                job.path("salary").path("name").asText(""),
                job.path("posting-date").asText(""),
                job.path("expiration-date").asText(""),
                "사람인"
        ));
    }

    private record CachedJobs(List<JobResponse> items, Instant cachedAt) {

        private static CachedJobs empty() {
            return new CachedJobs(List.of(), Instant.EPOCH);
        }

        private boolean isFresh() {
            return !items.isEmpty() && cachedAt.plus(CACHE_TTL).isAfter(Instant.now());
        }
    }
}
