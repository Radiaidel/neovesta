package com.neovesta.backend.models;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Embeddable
@Getter
@Setter
public class Document {
    private String name;
    private String url;
    private String type;
    private LocalDateTime uploadedAt = LocalDateTime.now();
}
