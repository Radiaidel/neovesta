package com.neovesta.backend.dtos.embedded;

import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResidentEmbeddedDTO {
    private UUID id;
    private String firstName;
    private String lastName;
}
