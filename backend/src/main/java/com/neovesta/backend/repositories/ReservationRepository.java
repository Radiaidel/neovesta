package com.neovesta.backend.repositories;

import com.neovesta.backend.models.Reservation;
import com.neovesta.backend.models.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ReservationRepository extends JpaRepository<Reservation, UUID> {

    List<Reservation> findByStatus(ReservationStatus status);
    List<Reservation> findByRequestedDateBetween(LocalDateTime startDate, LocalDateTime endDate);
}
