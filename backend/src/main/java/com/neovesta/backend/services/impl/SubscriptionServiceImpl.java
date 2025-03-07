package com.neovesta.backend.services.impl;

import com.neovesta.backend.dtos.request.SubscriptionRequestDTO;
import com.neovesta.backend.dtos.response.SubscriptionResponseDTO;
import com.neovesta.backend.exceptions.ResourceNotFoundException;
import com.neovesta.backend.mappers.SubscriptionMapper;
import com.neovesta.backend.models.Subscription;
import com.neovesta.backend.models.enums.PaymentStatus;
import com.neovesta.backend.repositories.SubscriptionRepository;
import com.neovesta.backend.services.SubscriptionService;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Transactional
@Service
public class SubscriptionServiceImpl implements SubscriptionService {
    private final SubscriptionRepository repository;
    private final SubscriptionMapper mapper;

    public SubscriptionServiceImpl(SubscriptionRepository repository, SubscriptionMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public SubscriptionResponseDTO createSubscription(SubscriptionRequestDTO dto) {
        Subscription subscription = mapper.fromRequestDTO(dto);
        repository.save(subscription);
        return mapper.toResponseDTO(subscription);
    }

    @Override
    public SubscriptionResponseDTO updateSubscription(UUID id, SubscriptionRequestDTO dto) {
        Subscription subscription = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with ID: " + id));

        if (dto.getPrice() != null) {
            subscription.setPrice(dto.getPrice());
        }
        if (dto.getType() != null) {
            subscription.setType(dto.getType());
        }

        repository.save(subscription);
        return mapper.toResponseDTO(subscription);
    }


    @Override
    public void deleteSubscription(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Subscription not found with ID: " + id);
        }
        repository.deleteById(id);
    }

    @Override
    public SubscriptionResponseDTO confirmSubscription(UUID id, String adminNote) {
        Subscription subscription = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with ID: " + id));

        subscription.setIsConfirmedByAdmin(true);
        subscription.setAdminNote(Objects.requireNonNull(adminNote, "Admin note cannot be null"));

        repository.save(subscription);
        return mapper.toResponseDTO(subscription);
    }

    @Override
    public SubscriptionResponseDTO refuseSubscription(UUID id, String adminNote) {
        Subscription subscription = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with ID: " + id));

        subscription.setIsConfirmedByAdmin(false);
        subscription.setAdminNote(Objects.requireNonNull(adminNote, "Admin note cannot be null"));

        repository.save(subscription);
        return mapper.toResponseDTO(subscription);
    }

    @Override
    public SubscriptionResponseDTO updatePaymentStatus(UUID id, String status) throws BadRequestException {
        Subscription subscription = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with ID: " + id));

        try {
            subscription.setPaymentStatus(PaymentStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid payment status: " + status);
        }

        repository.save(subscription);
        return mapper.toResponseDTO(subscription);
    }


    @Override
    public SubscriptionResponseDTO getSubscriptionById(UUID id) {
        Subscription subscription = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with ID: " + id));
        return mapper.toResponseDTO(subscription);
    }

    @Override
    public List<SubscriptionResponseDTO> getSubscriptionsByUser(UUID userId) {
        return repository.findByUserId(userId)
                .stream()
                .map(mapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SubscriptionResponseDTO> getSubscriptionsByFeature(UUID featureId) {
        return repository.findByFeatureId(featureId)
                .stream()
                .map(mapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SubscriptionResponseDTO> getActiveSubscriptions() {
        return repository.findByIsActiveTrue()
                .stream()
                .map(mapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SubscriptionResponseDTO> getConfirmedSubscriptions() {
        return repository.findByIsConfirmedByAdminTrue()
                .stream()
                .map(mapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SubscriptionResponseDTO> getSubscriptionsByPeriod(LocalDate start, LocalDate end) throws BadRequestException {
        if (start.isAfter(end)) {
            throw new BadRequestException("Start date must be before end date.");
        }

        return repository.findByStartDateBetween(start, end)
                .stream()
                .map(mapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
public Page<SubscriptionResponseDTO> getSubscriptionsByResidence(UUID residenceId, Pageable pageable) {
    Page<Subscription> subscriptions = repository.findByFeatureResidenceId(residenceId, pageable);
    return subscriptions.map(mapper::toResponseDTO);
}
}
