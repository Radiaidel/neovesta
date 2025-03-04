package com.neovesta.backend.dtos.request;

import com.neovesta.backend.models.enums.ResidenceStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

@Data
public class CreateResidenceRequest {
    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    // private List<String> imageUrls;

    @Valid
    @NotNull(message = "Address is required")
    private AddressRequest address;

    @Min(value = 1, message = "Total apartments must be at least 1")
    private Integer totalApartments;

    @Min(value = 0, message = "Available apartments cannot be negative")
    private Integer availableApartments;

    @DecimalMin(value = "0.0", message = "Starting price cannot be negative")
    private BigDecimal startingPrice;

    private List<String> amenities;

    // private List<DocumentRequest> documents;
    private List<MultipartFile> images;
    private List<DocumentUploadRequest> documents;
 

    private UUID managerId;

    private String contactInformation;
    private ResidenceStatus status;

}
