package com.neovesta.backend.services.impl;

import com.neovesta.backend.dtos.request.ReservationRequestDTO;
import com.neovesta.backend.dtos.response.PageResponse;
import com.neovesta.backend.dtos.response.ReservationResponseDTO;
import com.neovesta.backend.exceptions.ResourceNotFoundException;
import com.neovesta.backend.mappers.ReservationMapper;
import com.neovesta.backend.models.Feature;
import com.neovesta.backend.models.Reservation;
import com.neovesta.backend.models.Resident;
import com.neovesta.backend.models.User;
import com.neovesta.backend.models.enums.ReservationStatus;
import com.neovesta.backend.repositories.FeatureRepository;
import com.neovesta.backend.repositories.ReservationRepository;
import com.neovesta.backend.repositories.UserRepository;
import com.neovesta.backend.services.ReservationService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository residentRepository;
    private final FeatureRepository featureRepository;
    private final ReservationMapper reservationMapper;

    public ReservationServiceImpl(ReservationRepository reservationRepository, UserRepository residentRepository,
            FeatureRepository featureRepository, ReservationMapper reservationMapper) {
        this.reservationRepository = reservationRepository;
        this.residentRepository = residentRepository;
        this.featureRepository = featureRepository;
        this.reservationMapper = reservationMapper;
    }

    @Override
    public ReservationResponseDTO createReservation(ReservationRequestDTO dto) {
        User resident = residentRepository.findResidentById(dto.getResidentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Resident not found or does not have the RESIDENT role: " + dto.getResidentId()));

        Feature feature = featureRepository.findById(dto.getFeatureId())
                .orElseThrow(() -> new ResourceNotFoundException("Feature not found"));

        Reservation reservation = Reservation.builder()
                .resident((Resident) resident)
                .feature(feature)
                .requestedDate(dto.getRequestedDate())
                .status(ReservationStatus.PENDING)
                .build();

        reservationRepository.save(reservation);
        return reservationMapper.toDTO(reservation);
    }

    @Override
    public ReservationResponseDTO updateReservation(UUID reservationId, ReservationRequestDTO dto) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        if (!reservation.canBeModified()) {
            throw new IllegalStateException("Reservation cannot be modified");
        }

        reservation.setRequestedDate(dto.getRequestedDate());
        reservationRepository.save(reservation);
        return reservationMapper.toDTO(reservation);
    }

    @Override
    public void deleteReservation(UUID reservationId) {
        reservationRepository.deleteById(reservationId);
    }

    @Override
    public ReservationResponseDTO confirmReservation(UUID reservationId, LocalDateTime scheduledDate) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservation.setScheduledDate(scheduledDate);
        reservationRepository.save(reservation);
        return reservationMapper.toDTO(reservation);
    }

    @Override
    public ReservationResponseDTO rejectReservation(UUID reservationId, String adminNote) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        reservation.setStatus(ReservationStatus.REJECTED);
        reservation.setAdminNote(adminNote);
        reservationRepository.save(reservation);
        return reservationMapper.toDTO(reservation);
    }

    @Override
    public List<ReservationResponseDTO> getReservationsByStatus(ReservationStatus status) {
        return reservationRepository.findByStatus(status)
                .stream()
                .map(reservationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReservationResponseDTO> getReservationsByDate(String filter) {
        LocalDateTime startDate;
        LocalDateTime endDate = LocalDateTime.now();

        switch (filter.toUpperCase()) {
            case "TODAY":
                startDate = LocalDateTime.now().toLocalDate().atStartOfDay();
                endDate = startDate.plusDays(1);
                break;
            case "WEEK":
                startDate = LocalDateTime.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).toLocalDate()
                        .atStartOfDay();
                endDate = startDate.plusWeeks(1);
                break;
            case "MONTH":
                startDate = LocalDateTime.now().with(TemporalAdjusters.firstDayOfMonth()).toLocalDate().atStartOfDay();
                endDate = startDate.plusMonths(1);
                break;
            default:
                throw new IllegalArgumentException("Filtre non valide. Utilisez TODAY, WEEK, ou MONTH.");
        }

        return reservationRepository.findByRequestedDateBetween(startDate, endDate)
                .stream()
                .map(reservationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public PageResponse<ReservationResponseDTO> getAllReservations(
            int page,
            int size,
            String sortBy,
            String sortDir,
            UUID residentId,
            UUID featureId,
            ReservationStatus status,
            String dateFilter,
            String search) {
        Sort.Direction direction = Sort.Direction.fromString(sortDir);
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Specification<Reservation> spec = Specification.where(null);

        if (residentId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("resident").get("id"), residentId));
        }
        if (featureId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("feature").get("id"), featureId));
        }
        if (status != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }
        if (dateFilter != null) {
            LocalDateTime now = LocalDateTime.now();
            switch (dateFilter) {
                case "upcoming":
                    spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("requestedDate"), now));
                    break;
                case "past":
                    spec = spec.and((root, query, cb) -> cb.lessThan(root.get("requestedDate"), now));
                    break;
            }
        }
        if (search != null && !search.trim().isEmpty()) {
            spec = spec.and((root, query, cb) -> {
                Join<Reservation, Feature> featureJoin = root.join("feature", JoinType.LEFT);
                Join<Reservation, Resident> residentJoin = root.join("resident", JoinType.LEFT);

                return cb.or(
                        cb.like(featureJoin.get("name"), "%" + search + "%"),
                        cb.like(residentJoin.get("firstName"), "%" + search + "%"),
                        cb.like(residentJoin.get("lastName"), "%" + search + "%"));
            });
        }

        Page<Reservation> pageResult = reservationRepository.findAll(spec, pageable);

        return PageResponse.<ReservationResponseDTO>builder()
                .content(pageResult.getContent().stream()
                        .map(reservation -> reservationMapper.toDTO(reservation))
                        .toList())
                .currentPage(pageResult.getNumber())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .build();
    }

    @Override
    @Transactional 
    public ReservationResponseDTO getReservationById(UUID id) {
        return reservationRepository.findByIdWithRelations(id)
                .map(reservation -> reservationMapper.toDTO(reservation))
                .orElseThrow(() -> new EntityNotFoundException("Reservation non trouvée"));
    }
}
