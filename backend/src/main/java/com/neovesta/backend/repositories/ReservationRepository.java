package com.neovesta.backend.repositories;

import com.neovesta.backend.models.Reservation;
import com.neovesta.backend.models.enums.ReservationStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReservationRepository extends JpaRepository<Reservation, UUID>,
                JpaSpecificationExecutor<Reservation> {

        List<Reservation> findByStatus(ReservationStatus status);

        List<Reservation> findByRequestedDateBetween(LocalDateTime startDate, LocalDateTime endDate);

        @Query("SELECT r FROM Reservation r " +
                        "LEFT JOIN FETCH r.feature " +
                        "LEFT JOIN FETCH r.resident " +
                        "WHERE r.id = :id")
        Optional<Reservation> findByIdWithRelations(@Param("id") UUID id);

        @SuppressWarnings("null")
        @EntityGraph(attributePaths = { "feature", "resident" })
        Page<Reservation> findAll(Specification<Reservation> spec, Pageable pageable);
}
