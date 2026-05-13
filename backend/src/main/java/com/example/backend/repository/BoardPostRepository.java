package com.example.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.BoardPost;

public interface BoardPostRepository extends JpaRepository<BoardPost, Long> {

    Page<BoardPost> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<BoardPost> findAllByTitleContainingIgnoreCaseOrContentContainingIgnoreCaseOrderByCreatedAtDesc(
            String title,
            String content,
            Pageable pageable
    );

    long countByAuthor(String author);
}
