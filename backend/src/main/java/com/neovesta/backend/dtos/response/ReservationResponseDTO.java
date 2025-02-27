package com.neovesta.backend.dtos.response;

import com.neovesta.backend.models.enums.ReservationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ReservationResponseDTO {
    private UUID id;
    private UUID residentId;
    private UUID featureId;
    private LocalDateTime requestedDate;
    private LocalDateTime scheduledDate;
    private ReservationStatus status;
    private String adminNote;
}
