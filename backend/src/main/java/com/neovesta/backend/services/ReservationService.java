package com.neovesta.backend.services;

import com.neovesta.backend.dtos.request.ReservationRequestDTO;
import com.neovesta.backend.dtos.response.ReservationResponseDTO;
import com.neovesta.backend.models.enums.ReservationStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ReservationService {
    ReservationResponseDTO createReservation(ReservationRequestDTO dto);
    ReservationResponseDTO updateReservation(UUID reservationId, ReservationRequestDTO dto);
    void deleteReservation(UUID reservationId);
    ReservationResponseDTO confirmReservation(UUID reservationId, LocalDateTime scheduledDate);
    ReservationResponseDTO rejectReservation(UUID reservationId, String adminNote);
    List<ReservationResponseDTO> getReservationsByStatus(ReservationStatus status);
    List<ReservationResponseDTO> getReservationsByDate(String filter);
}
