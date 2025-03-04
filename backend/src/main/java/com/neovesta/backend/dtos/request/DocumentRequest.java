package com.neovesta.backend.dtos.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DocumentRequest {
    @NotBlank(message = "Document name is required")
    private String name;

    @NotBlank(message = "Document URL is required")
    private String url;

    @NotBlank(message = "Document type is required")
    private String type;
}
