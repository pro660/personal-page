package com.example.backend.dto;

public record AuthResponse(Long id, String username, String email, String token, String refreshToken) {
}
