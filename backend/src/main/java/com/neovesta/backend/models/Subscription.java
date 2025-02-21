package com.neovesta.backend.models;

import com.neovesta.backend.models.enums.ReservationStatus;
import com.neovesta.backend.models.enums.SubscriptionPeriod;
import com.neovesta.backend.models.enums.SubscriptionStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "subscriptions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resident_id", nullable = false)
    private Resident resident; // Résident qui fait la demande

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "feature_id", nullable = false)
    private Feature feature; // Service souscrit

    @Enumerated(EnumType.STRING)
    @Column(name = "subscription_period", nullable = false)
    private SubscriptionPeriod subscriptionPeriod; // MONTHLY, QUARTERLY, YEARLY

    @Column(name = "start_date")
    private LocalDate startDate; // Date de début confirmée

    @Column(name = "end_date")
    private LocalDate endDate; // Date de fin selon la période

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SubscriptionStatus status; // PENDING, ACTIVE, CANCELED, REFUSED

    @Column(name = "admin_note", columnDefinition = "TEXT")
    private String adminNote; // Note explicative en cas de refus

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy; // Gestionnaire qui valide ou refuse l’abonnement

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
