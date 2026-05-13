package com.example.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.dto.CommentRequest;
import com.example.backend.entity.Comment;
import com.example.backend.repository.BoardPostRepository;
import com.example.backend.repository.CommentRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class CommentController {

    private final BoardPostRepository boardPostRepository;
    private final CommentRepository commentRepository;

    public CommentController(BoardPostRepository boardPostRepository, CommentRepository commentRepository) {
        this.boardPostRepository = boardPostRepository;
        this.commentRepository = commentRepository;
    }

    @GetMapping("/posts/{postId}/comments")
    public List<Comment> getComments(@PathVariable Long postId) {
        validatePost(postId);
        return commentRepository.findAllByPostIdOrderByCreatedAtAsc(postId);
    }

    @PostMapping("/posts/{postId}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    public Comment createComment(
            @PathVariable Long postId,
            @Valid @RequestBody CommentRequest request,
            Authentication authentication
    ) {
        validatePost(postId);
        return commentRepository.save(new Comment(postId, authentication.getName(), request.content()));
    }

    @PutMapping("/comments/{commentId}")
    public Comment updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentRequest request,
            Authentication authentication
    ) {
        Comment comment = findComment(commentId);
        validateAuthor(comment, authentication);
        comment.update(request.content());
        return commentRepository.save(comment);
    }

    @DeleteMapping("/comments/{commentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteComment(@PathVariable Long commentId, Authentication authentication) {
        Comment comment = findComment(commentId);
        validateAuthor(comment, authentication);
        commentRepository.delete(comment);
    }

    private void validatePost(Long postId) {
        if (!boardPostRepository.existsById(postId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");
        }
    }

    private Comment findComment(Long commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));
    }

    private void validateAuthor(Comment comment, Authentication authentication) {
        if (authentication == null || !comment.getAuthor().equals(authentication.getName())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the author can change this comment");
        }
    }
}
