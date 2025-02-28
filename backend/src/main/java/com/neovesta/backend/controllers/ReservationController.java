package com.neovesta.backend.controllers;

import com.neovesta.backend.dtos.request.ReservationRequestDTO;
import com.neovesta.backend.dtos.response.ReservationResponseDTO;
import com.neovesta.backend.models.enums.ReservationStatus;
import com.neovesta.backend.services.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationResponseDTO> createReservation(@Valid @RequestBody ReservationRequestDTO dto) {
        return ResponseEntity.ok(reservationService.createReservation(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservationResponseDTO> updateReservation(@PathVariable UUID id, @Valid @RequestBody ReservationRequestDTO dto) {
        return ResponseEntity.ok(reservationService.updateReservation(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable UUID id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/confirm")
    public ResponseEntity<ReservationResponseDTO> confirmReservation(
            @PathVariable UUID id,
            @RequestParam LocalDateTime scheduledDate) {
        return ResponseEntity.ok(reservationService.confirmReservation(id, scheduledDate));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<ReservationResponseDTO> rejectReservation(
            @PathVariable UUID id,
            @RequestParam String adminNote) {
        return ResponseEntity.ok(reservationService.rejectReservation(id, adminNote));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ReservationResponseDTO>> getReservationsByStatus(@PathVariable ReservationStatus status) {
        return ResponseEntity.ok(reservationService.getReservationsByStatus(status));
    }

    @GetMapping("/date")
    public ResponseEntity<List<ReservationResponseDTO>> getReservationsByDate(@RequestParam String filter) {
        return ResponseEntity.ok(reservationService.getReservationsByDate(filter));
    }

}
