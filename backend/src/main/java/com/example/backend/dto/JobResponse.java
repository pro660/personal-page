package com.example.backend.dto;

public record JobResponse(
        String id,
        String title,
        String company,
        String url,
        String location,
        String jobType,
        String experience,
        String salary,
        String postedAt,
        String deadlineAt,
        String source
) {
}
