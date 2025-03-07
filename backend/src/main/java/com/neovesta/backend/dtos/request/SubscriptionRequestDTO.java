package com.neovesta.backend.dtos.request;

import com.neovesta.backend.models.enums.PaymentStatus;
import com.neovesta.backend.models.enums.SubscriptionType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class SubscriptionRequestDTO {
    private UUID userId;
    private UUID featureId;
    private SubscriptionType type;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double price;
    private PaymentStatus paymentStatus;
    private Boolean isActive;
    private Boolean isConfirmedByAdmin;
    private String userNote;
}

