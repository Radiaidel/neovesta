package com.neovesta.backend.dtos.request;

import com.neovesta.backend.models.enums.ResidenceStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DocumentRequest {
    @NotBlank(message = "Document name is required")
    private String name;

    @NotBlank(message = "Document URL is required")
    private String url;

    @NotBlank(message = "Document type is required")
    private String type;

    private ResidenceStatus status;
}
