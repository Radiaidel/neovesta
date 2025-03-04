package com.neovesta.backend.dtos.request;

import org.springframework.web.multipart.MultipartFile;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DocumentUploadRequest {
    @NotBlank
    private String name;
    
    @NotNull
    private MultipartFile file;
    
    @NotBlank
    private String type;
}