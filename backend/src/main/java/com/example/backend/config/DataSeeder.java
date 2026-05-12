package com.example.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.backend.entity.Project;
import com.example.backend.repository.ProjectRepository;

@Configuration
public class DataSeeder {

    private static final String GITHUB_URL = "https://github.com/pro660";
    private static final String OLD_GITHUB_URL = "https://github.com/your-name/personal-page";

    @Bean
    CommandLineRunner seedProjects(ProjectRepository projectRepository) {
        return args -> {
            projectRepository.findByTitle("Personal Page")
                    .ifPresent(project -> {
                        project.updateGithubUrl(GITHUB_URL);
                        projectRepository.save(project);
                    });

            projectRepository.findAllByGithubUrl(OLD_GITHUB_URL)
                    .forEach(project -> {
                        project.updateGithubUrl(GITHUB_URL);
                        projectRepository.save(project);
                    });

            if (projectRepository.count() > 0) {
                return;
            }

            projectRepository.save(new Project(
                    "Personal Page",
                    "React CRA frontend and Spring Boot backend connected to MySQL.",
                    GITHUB_URL,
                    ""
            ));
            projectRepository.save(new Project(
                    "Portfolio API",
                    "REST APIs for profile, skills, projects, and contact messages.",
                    "",
                    ""
            ));
        };
    }
}
