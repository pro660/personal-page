package com.example.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.backend.entity.BoardPost;
import com.example.backend.entity.Project;
import com.example.backend.repository.BoardPostRepository;
import com.example.backend.repository.ProjectRepository;

@Configuration
public class DataSeeder {

    private static final String GITHUB_URL = "https://github.com/pro660";
    private static final String OLD_GITHUB_URL = "https://github.com/your-name/personal-page";

    @Bean
    CommandLineRunner seedData(ProjectRepository projectRepository, BoardPostRepository boardPostRepository) {
        return args -> {
            updateLegacyProjectUrl(projectRepository);
            seedProjects(projectRepository);
            seedBoardPosts(boardPostRepository);
        };
    }

    private void updateLegacyProjectUrl(ProjectRepository projectRepository) {
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
    }

    private void seedProjects(ProjectRepository projectRepository) {
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
    }

    private void seedBoardPosts(BoardPostRepository boardPostRepository) {
        if (boardPostRepository.count() > 0) {
            return;
        }

        boardPostRepository.save(new BoardPost(
                "첫 번째 게시글입니다.",
                "React Router로 목록에서 상세 페이지까지 이동하는 흐름을 확인하는 예시 글입니다.",
                "admin"
        ));
        boardPostRepository.save(new BoardPost(
                "CRUD 게시판 작업 노트",
                "작성, 조회, 수정, 삭제 흐름을 Spring Boot API와 React 화면으로 연결했습니다.",
                "admin"
        ));
    }
}
