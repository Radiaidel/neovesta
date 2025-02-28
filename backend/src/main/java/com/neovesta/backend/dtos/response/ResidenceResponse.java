package com.neovesta.backend.dtos.response;

import com.neovesta.backend.models.enums.ResidenceStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class ResidenceResponse {
    private UUID id;
    private String name;
    private String description;
    private List<String> imageUrls;
    private AddressResponse address;
    private Integer totalApartments;
    private Integer availableApartments;
    private BigDecimal startingPrice;
    private List<String> amenities;
    private List<DocumentResponse> documents;
    private UserResponse manager;
    private String contactInformation;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private ResidenceStatus status;
}
