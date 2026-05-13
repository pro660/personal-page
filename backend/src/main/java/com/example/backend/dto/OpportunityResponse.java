package com.example.backend.dto;

public record OpportunityResponse(
        String title,
        String description,
        String url,
        String source,
        String type,
        String publishedAt
) {
}
