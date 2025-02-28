package com.neovesta.backend.dtos.request;

import com.neovesta.backend.models.enums.ContractType;
import com.neovesta.backend.models.enums.PaymentFrequency;
import com.neovesta.backend.models.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Builder
public record ContractRequest(
        @NotNull UUID residentId,
        @NotNull UUID residenceId,
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate,
        @NotNull ContractType contractType,
        @NotNull BigDecimal totalAmount,
        @NotNull BigDecimal paidAmount,
        @NotNull PaymentFrequency paymentFrequency,
        @NotNull PaymentMethod paymentMethod,
        String contractRules
) {}
