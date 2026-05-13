package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BoardPostRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 120, message = "Title must be 120 characters or less")
        String title,

        @NotBlank(message = "Content is required")
        @Size(max = 5000, message = "Content must be 5000 characters or less")
        String content,

        String author
) {
}
