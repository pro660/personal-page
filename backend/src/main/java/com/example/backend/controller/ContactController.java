package com.example.backend.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.ContactRequest;
import com.example.backend.entity.ContactMessage;
import com.example.backend.repository.ContactMessageRepository;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactMessageRepository contactMessageRepository;

    public ContactController(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> createContactMessage(@RequestBody ContactRequest request) {
        ContactMessage contactMessage = new ContactMessage(
                request.name(),
                request.email(),
                request.message()
        );
        contactMessageRepository.save(contactMessage);
        return Map.of("message", "Contact message saved");
    }
}
