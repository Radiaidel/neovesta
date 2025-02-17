package com.neovesta.backend.dtos.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DocumentResponse {
    private String name;
    private String url;
    private String type;
    private LocalDateTime uploadedAt;
}
