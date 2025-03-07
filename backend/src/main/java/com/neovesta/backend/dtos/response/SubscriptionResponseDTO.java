package com.neovesta.backend.dtos.response;

import com.neovesta.backend.dtos.embedded.FeatureEmbeddedDTO;
import com.neovesta.backend.dtos.embedded.UserEmbeddedDTO;
import com.neovesta.backend.models.enums.PaymentStatus;
import com.neovesta.backend.models.enums.SubscriptionType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class SubscriptionResponseDTO {
    private UUID id;
    private UserEmbeddedDTO user;
    private FeatureEmbeddedDTO feature;
    private SubscriptionType type;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double price;
    private PaymentStatus paymentStatus;
    private Boolean isActive;
    private Boolean isConfirmedByAdmin;
    private String adminNote;
    private String userNote;
}

