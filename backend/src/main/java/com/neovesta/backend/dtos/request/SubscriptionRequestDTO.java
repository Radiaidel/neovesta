package com.neovesta.backend.dtos.request;

import com.neovesta.backend.models.enums.PaymentStatus;
import com.neovesta.backend.models.enums.SubscriptionType;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class SubscriptionRequestDTO {

    public UUID userId;
    public UUID featureId;
    public SubscriptionType type;
    public LocalDate startDate;
    public LocalDate endDate;
    public Double price;
    public PaymentStatus paymentStatus;
    Boolean isActive;
    Boolean isConfirmedByAdmin;

}
