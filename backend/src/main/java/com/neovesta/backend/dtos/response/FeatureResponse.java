package com.neovesta.backend.dtos.response;

import com.neovesta.backend.dtos.embedded.ResidenceEmbeddedDTO;
import com.neovesta.backend.models.enums.FeatureCategory;
import com.neovesta.backend.models.enums.FeatureType;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class FeatureResponse {
    private UUID id;
    private ResidenceEmbeddedDTO residence;
    private String residenceName;
    private String name;
    private String description;
    private FeatureType featureType;
    private FeatureCategory featureCategory;
    private String location;
    private Boolean active;
    private String imageUrl;
    private String termsAndConditions;
    private String cancellationPolicy;
    private Boolean requiresManagerApproval;
}
