package com.neovesta.backend.dtos.response;

import com.neovesta.backend.dtos.embedded.FeatureEmbeddedDTO;
import com.neovesta.backend.dtos.embedded.ResidentEmbeddedDTO;
import com.neovesta.backend.models.Resident;
import com.neovesta.backend.models.enums.ReservationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ReservationResponseDTO {
    private UUID id;
     private ResidentEmbeddedDTO resident;
    private FeatureEmbeddedDTO feature;
    private LocalDateTime requestedDate;
    private LocalDateTime scheduledDate;
    private ReservationStatus status;
    private String adminNote;
}
