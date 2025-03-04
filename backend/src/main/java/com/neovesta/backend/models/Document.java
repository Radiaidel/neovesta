package com.neovesta.backend.models;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@Embeddable
@NoArgsConstructor  // Ajout crucial pour JPA
@AllArgsConstructor // Nécessaire pour le Builder
public class Document {
    private String name;
    private String url;
    private String type;
}