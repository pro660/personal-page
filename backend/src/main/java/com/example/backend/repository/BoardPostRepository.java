package com.example.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.BoardPost;

public interface BoardPostRepository extends JpaRepository<BoardPost, Long> {

    List<BoardPost> findAllByOrderByCreatedAtDesc();
}
