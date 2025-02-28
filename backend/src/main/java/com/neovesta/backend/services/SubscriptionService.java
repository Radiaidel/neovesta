package com.neovesta.backend.services;

import com.neovesta.backend.dtos.request.SubscriptionRequestDTO;
import com.neovesta.backend.dtos.response.SubscriptionResponseDTO;
import org.apache.coyote.BadRequestException;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface SubscriptionService {

    SubscriptionResponseDTO createSubscription(SubscriptionRequestDTO dto);
    SubscriptionResponseDTO updateSubscription(UUID id, SubscriptionRequestDTO dto);
    void deleteSubscription(UUID id);
    SubscriptionResponseDTO confirmSubscription(UUID id, String adminNote);
    SubscriptionResponseDTO refuseSubscription(UUID id, String adminNote);
    SubscriptionResponseDTO updatePaymentStatus(UUID id, String status) throws BadRequestException;
    SubscriptionResponseDTO getSubscriptionById(UUID id);
    List<SubscriptionResponseDTO> getSubscriptionsByUser(UUID userId);
    List<SubscriptionResponseDTO> getSubscriptionsByFeature(UUID featureId);
    List<SubscriptionResponseDTO> getActiveSubscriptions();
    List<SubscriptionResponseDTO> getConfirmedSubscriptions();
    List<SubscriptionResponseDTO> getSubscriptionsByPeriod(LocalDate start, LocalDate end) throws BadRequestException;
}
