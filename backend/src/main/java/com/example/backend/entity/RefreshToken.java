package com.example.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String token;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 40)
    private String username;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    protected RefreshToken() {
    }

    public RefreshToken(String token, Long userId, String username, LocalDateTime expiresAt) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.expiresAt = expiresAt;
    }

    public String getToken() {
        return token;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }
}
