package com.example.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.dto.PasswordChangeRequest;
import com.example.backend.dto.UserProfileResponse;
import com.example.backend.entity.User;
import com.example.backend.repository.BoardPostRepository;
import com.example.backend.repository.CommentRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.PasswordHasher;
import com.example.backend.service.RefreshTokenService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final BoardPostRepository boardPostRepository;
    private final CommentRepository commentRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordHasher legacyPasswordHasher;
    private final RefreshTokenService refreshTokenService;

    public UserController(
            UserRepository userRepository,
            BoardPostRepository boardPostRepository,
            CommentRepository commentRepository,
            PasswordEncoder passwordEncoder,
            PasswordHasher legacyPasswordHasher,
            RefreshTokenService refreshTokenService
    ) {
        this.userRepository = userRepository;
        this.boardPostRepository = boardPostRepository;
        this.commentRepository = commentRepository;
        this.passwordEncoder = passwordEncoder;
        this.legacyPasswordHasher = legacyPasswordHasher;
        this.refreshTokenService = refreshTokenService;
    }

    @GetMapping("/me")
    public UserProfileResponse getMe(Authentication authentication) {
        User user = findCurrentUser(authentication);
        return new UserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getCreatedAt(),
                boardPostRepository.countByAuthor(user.getUsername()),
                commentRepository.countByAuthor(user.getUsername())
        );
    }

    @PutMapping("/me/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(
            Authentication authentication,
            @Valid @RequestBody PasswordChangeRequest request
    ) {
        User user = findCurrentUser(authentication);

        if (!isPasswordMatched(request.currentPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Current password does not match");
        }

        user.changePasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        refreshTokenService.revokeByUsername(user.getUsername());
    }

    private User findCurrentUser(Authentication authentication) {
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private boolean isPasswordMatched(String rawPassword, String storedPassword) {
        if (storedPassword != null && storedPassword.startsWith("$2")) {
            return passwordEncoder.matches(rawPassword, storedPassword);
        }

        return legacyPasswordHasher.hash(rawPassword).equals(storedPassword);
    }
}
