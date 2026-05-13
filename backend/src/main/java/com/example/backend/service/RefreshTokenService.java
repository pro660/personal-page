package com.example.backend.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.entity.RefreshToken;
import com.example.backend.entity.User;
import com.example.backend.repository.RefreshTokenRepository;
import com.example.backend.repository.UserRepository;

@Service
public class RefreshTokenService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final long expirationDays;

    public RefreshTokenService(
            RefreshTokenRepository refreshTokenRepository,
            UserRepository userRepository,
            @Value("${app.refresh-token.expiration-days}") long expirationDays
    ) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
        this.expirationDays = expirationDays;
    }

    @Transactional
    public String issue(User user) {
        refreshTokenRepository.deleteByUsername(user.getUsername());
        RefreshToken refreshToken = refreshTokenRepository.save(new RefreshToken(
                createRandomToken(),
                user.getId(),
                user.getUsername(),
                LocalDateTime.now().plusDays(expirationDays)
        ));

        return refreshToken.getToken();
    }

    @Transactional
    public User rotate(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));

        if (refreshToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.deleteByToken(token);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Expired refresh token");
        }

        User user = userRepository.findByUsername(refreshToken.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        refreshTokenRepository.deleteByToken(token);
        return user;
    }

    @Transactional
    public void revoke(String token) {
        refreshTokenRepository.deleteByToken(token);
    }

    @Transactional
    public void revokeByUsername(String username) {
        refreshTokenRepository.deleteByUsername(username);
    }

    private String createRandomToken() {
        byte[] bytes = new byte[48];
        SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
