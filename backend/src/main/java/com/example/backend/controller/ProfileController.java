package com.example.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ProfileController {

    @GetMapping("/profile")
    public ProfileResponse profile() {
        return new ProfileResponse(
                "console.log(\"김형석\")",
                "React와 Spring Boot, MySQL을 연결하며 풀스택 흐름을 익히는 포트폴리오입니다.",
                "Full-stack learner",
                "Seoul, Korea"
        );
    }

    @GetMapping("/skills")
    public List<String> skills() {
        return List.of("React", "Spring Boot", "Java", "MySQL", "REST API", "JPA");
    }

    public record ProfileResponse(String name, String intro, String role, String location) {
    }
}
