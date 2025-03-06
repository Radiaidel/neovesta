package com.neovesta.backend.dtos.request;

import jakarta.validation.Valid;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

@Data
public class UpdateResidenceRequest {
    private String name;
    private String description;
    private List<MultipartFile> images;

    @Valid
    private AddressRequest address;

    private Integer totalApartments;
    private Integer availableApartments;
    private BigDecimal startingPrice;
    private List<String> amenities;
    private List<DocumentUploadRequest> documents;
    private String contactInformation;
}
