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

    public UUID id;
    public UserEmbeddedDTO user;
    public FeatureEmbeddedDTO feature;
    public SubscriptionType type;
    public LocalDate startDate;
    public LocalDate endDate;
    public Double price;
    public PaymentStatus paymentStatus;
    public Boolean isActive;
    public Boolean isConfirmedByAdmin;
    public String adminNote;
}
