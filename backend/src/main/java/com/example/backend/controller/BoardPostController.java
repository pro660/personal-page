package com.example.backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.dto.BoardPostRequest;
import com.example.backend.entity.BoardPost;
import com.example.backend.repository.BoardPostRepository;
import com.example.backend.repository.CommentRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/posts")
public class BoardPostController {

    private final BoardPostRepository boardPostRepository;
    private final CommentRepository commentRepository;

    public BoardPostController(BoardPostRepository boardPostRepository, CommentRepository commentRepository) {
        this.boardPostRepository = boardPostRepository;
        this.commentRepository = commentRepository;
    }

    @GetMapping
    public Page<BoardPost> getPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(defaultValue = "") String keyword
    ) {
        Pageable pageable = PageRequest.of(
                Math.max(page, 0),
                Math.min(Math.max(size, 1), 30),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        if (keyword == null || keyword.isBlank()) {
            return boardPostRepository.findAllByOrderByCreatedAtDesc(pageable);
        }

        return boardPostRepository.findAllByTitleContainingIgnoreCaseOrContentContainingIgnoreCaseOrderByCreatedAtDesc(
                keyword.trim(),
                keyword.trim(),
                pageable
        );
    }

    @GetMapping("/{id}")
    public BoardPost getPost(@PathVariable Long id) {
        return findPost(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BoardPost createPost(@Valid @RequestBody BoardPostRequest request, Authentication authentication) {
        return boardPostRepository.save(new BoardPost(
                request.title(),
                request.content(),
                authentication.getName()
        ));
    }

    @PutMapping("/{id}")
    public BoardPost updatePost(
            @PathVariable Long id,
            @Valid @RequestBody BoardPostRequest request,
            Authentication authentication
    ) {
        BoardPost post = findPost(id);
        validateAuthor(post, authentication);
        post.update(request.title(), request.content());
        return boardPostRepository.save(post);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePost(@PathVariable Long id, Authentication authentication) {
        BoardPost post = findPost(id);
        validateAuthor(post, authentication);
        commentRepository.deleteByPostId(post.getId());
        boardPostRepository.delete(post);
    }

    private BoardPost findPost(Long id) {
        return boardPostRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
    }

    private void validateAuthor(BoardPost post, Authentication authentication) {
        if (authentication == null || !post.getAuthor().equals(authentication.getName())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the author can change this post");
        }
    }
}
