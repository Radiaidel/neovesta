package com.neovesta.backend.dtos.request;

import com.neovesta.backend.models.enums.FeatureCategory;
import com.neovesta.backend.models.enums.FeatureType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class FeatureRequest {
    @NotNull(message = "Residence ID is required")
    private UUID residenceId;

    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    @NotNull(message = "Feature type is required")
    private FeatureType featureType;

    @NotNull(message = "Feature category is required")
    private FeatureCategory featureCategory;

    private String location;

    @NotNull(message = "Active status is required")
    private Boolean active;

    private String imageUrl;
    private String termsAndConditions;
    private String cancellationPolicy;
    private Boolean requiresManagerApproval;
}