package com.neovesta.backend.dtos.request;

import jakarta.validation.Valid;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class UpdateResidenceRequest {
    private String name;
    private String description;
    private List<String> imageUrls;

    @Valid
    private AddressRequest address;

    private Integer totalApartments;
    private Integer availableApartments;
    private BigDecimal startingPrice;
    private List<String> amenities;
    private List<DocumentRequest> documents;
    private String contactInformation;
}
