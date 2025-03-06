package com.neovesta.backend.dtos.response;

import com.neovesta.backend.models.enums.FeatureCategory;
import com.neovesta.backend.models.enums.FeatureType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeatureResponse {
    
    private UUID id;
    private String name;
    private String description;
    private FeatureType featureType;
    private FeatureCategory featureCategory;
    private BigDecimal price;
    private Boolean active;
    private String termsAndConditions;
    private String cancellationPolicy;
    private Boolean requiresManagerApproval;
    private UUID residenceId;
    private String residenceName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private String imageUrl;
}