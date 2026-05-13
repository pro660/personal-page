package com.example.backend.dto;

import java.time.LocalDateTime;

public record UserProfileResponse(
        Long id,
        String username,
        String email,
        LocalDateTime createdAt,
        long postCount,
        long commentCount
) {
}
