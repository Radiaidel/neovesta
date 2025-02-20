package com.neovesta.backend.dtos.embedded;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Setter
@Getter
public class ResidenceEmbeddedDTO {
    private UUID id;
    private String name;
}
