package com.neovesta.backend.models;

import com.neovesta.backend.models.enums.ReservationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reservations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "resident_id", nullable = false)
    private Resident resident;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "feature_id", nullable = false)
    private Feature feature;

    @Column(name = "requested_date", nullable = false)
    private LocalDateTime requestedDate; // Date demandée par le résident

    @Column(name = "scheduled_date")
    private LocalDateTime scheduledDate; // Date confirmée par l'admin

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReservationStatus status;

    @Column(name = "admin_note", columnDefinition = "TEXT")
    private String adminNote; // Note de l'admin en cas de refus

    public boolean canBeModified() {
        return this.status == ReservationStatus.PENDING;
    }
}
