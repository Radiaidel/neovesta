package com.neovesta.backend.dtos.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ReservationRequestDTO {

    @NotNull(message = "L'ID du résident est requis.")
    private UUID residentId;

    @NotNull(message = "L'ID du service est requis.")
    private UUID featureId;

    @Future(message = "La date demandée doit être dans le futur.")
    @NotNull(message = "La date de réservation est requise.")
    private LocalDateTime requestedDate;
}
