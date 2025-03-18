package com.neovesta.backend.dtos.response;

import com.neovesta.backend.dtos.embedded.ResidenceEmbeddedDTO;
import com.neovesta.backend.dtos.embedded.ResidentEmbeddedDTO;
import com.neovesta.backend.models.enums.ContractStatus;
import com.neovesta.backend.models.enums.ContractType;
import com.neovesta.backend.models.enums.PaymentFrequency;
import com.neovesta.backend.models.enums.PaymentMethod;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Builder
public record ContractResponse(
        UUID id,
        ResidentEmbeddedDTO resident ,
         ResidenceEmbeddedDTO residence,
        UUID residentId,
        UUID residenceId,
        LocalDate startDate,
        LocalDate endDate,
        int durationInMonths,
        ContractType contractType,
        ContractStatus status,
        BigDecimal totalAmount,
        BigDecimal paidAmount,
        BigDecimal remainingAmount,
        PaymentFrequency paymentFrequency,
        PaymentMethod paymentMethod,
        String cancellationReason,
        String contractRules
) {}
