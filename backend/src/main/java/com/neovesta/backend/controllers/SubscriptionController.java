package com.neovesta.backend.controllers;

import com.neovesta.backend.dtos.request.SubscriptionRequestDTO;
import com.neovesta.backend.dtos.response.SubscriptionResponseDTO;
import com.neovesta.backend.services.SubscriptionService;
import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/subscriptions")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @PostMapping
    public ResponseEntity<SubscriptionResponseDTO> create(@RequestBody SubscriptionRequestDTO dto) {
        return ResponseEntity.ok(subscriptionService.createSubscription(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubscriptionResponseDTO> update(@PathVariable UUID id, @RequestBody SubscriptionRequestDTO dto) {
        return ResponseEntity.ok(subscriptionService.updateSubscription(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        subscriptionService.deleteSubscription(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/confirm")
    public ResponseEntity<SubscriptionResponseDTO> confirm(@PathVariable UUID id, @RequestParam String adminNote) {
        return ResponseEntity.ok(subscriptionService.confirmSubscription(id, adminNote));
    }

    @PatchMapping("/{id}/refuse")
    public ResponseEntity<SubscriptionResponseDTO> refuse(@PathVariable UUID id, @RequestParam String adminNote) {
        return ResponseEntity.ok(subscriptionService.refuseSubscription(id, adminNote));
    }

    @PatchMapping("/{id}/payment-status")
    public ResponseEntity<SubscriptionResponseDTO> updatePaymentStatus(@PathVariable UUID id, @RequestParam String status) throws BadRequestException {
        return ResponseEntity.ok(subscriptionService.updatePaymentStatus(id, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionResponseDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SubscriptionResponseDTO>> getByUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionsByUser(userId));
    }

    @GetMapping("/feature/{featureId}")
    public ResponseEntity<List<SubscriptionResponseDTO>> getByFeature(@PathVariable UUID featureId) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionsByFeature(featureId));
    }

    @GetMapping("/active")
    public ResponseEntity<List<SubscriptionResponseDTO>> getActive() {
        return ResponseEntity.ok(subscriptionService.getActiveSubscriptions());
    }

    @GetMapping("/confirmed")
    public ResponseEntity<List<SubscriptionResponseDTO>> getConfirmed() {
        return ResponseEntity.ok(subscriptionService.getConfirmedSubscriptions());
    }

    @GetMapping("/period")
    public ResponseEntity<List<SubscriptionResponseDTO>> getByPeriod(@RequestParam LocalDate start, @RequestParam LocalDate end) throws BadRequestException {
        return ResponseEntity.ok(subscriptionService.getSubscriptionsByPeriod(start, end));
    }
}