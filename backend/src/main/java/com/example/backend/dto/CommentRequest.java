package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CommentRequest(
        @NotBlank(message = "Comment is required")
        @Size(max = 1000, message = "Comment must be 1000 characters or less")
        String content
) {
}
