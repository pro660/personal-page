package com.example.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
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

import com.example.backend.dto.BoardPostRequest;
import com.example.backend.entity.BoardPost;
import com.example.backend.repository.BoardPostRepository;

@RestController
@RequestMapping("/api/posts")
public class BoardPostController {

    private final BoardPostRepository boardPostRepository;

    public BoardPostController(BoardPostRepository boardPostRepository) {
        this.boardPostRepository = boardPostRepository;
    }

    @GetMapping
    public List<BoardPost> getPosts() {
        return boardPostRepository.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/{id}")
    public BoardPost getPost(@PathVariable Long id) {
        return findPost(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BoardPost createPost(@RequestBody BoardPostRequest request) {
        validatePostRequest(request);
        return boardPostRepository.save(new BoardPost(
                request.title(),
                request.content(),
                isBlank(request.author()) ? "anonymous" : request.author()
        ));
    }

    @PutMapping("/{id}")
    public BoardPost updatePost(@PathVariable Long id, @RequestBody BoardPostRequest request) {
        validatePostRequest(request);
        BoardPost post = findPost(id);
        post.update(request.title(), request.content());
        return boardPostRepository.save(post);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePost(@PathVariable Long id) {
        boardPostRepository.delete(findPost(id));
    }

    private BoardPost findPost(Long id) {
        return boardPostRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다."));
    }

    private void validatePostRequest(BoardPostRequest request) {
        if (isBlank(request.title()) || isBlank(request.content())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "제목과 내용을 입력해 주세요.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
