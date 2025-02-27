package com.neovesta.backend.services.impl;

import com.neovesta.backend.dtos.request.ReservationRequestDTO;
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
import org.springframework.stereotype.Service;

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

    public ReservationServiceImpl(ReservationRepository reservationRepository, UserRepository residentRepository, FeatureRepository featureRepository, ReservationMapper reservationMapper) {
        this.reservationRepository = reservationRepository;
        this.residentRepository = residentRepository;
        this.featureRepository = featureRepository;
        this.reservationMapper = reservationMapper;
    }

    @Override
    public ReservationResponseDTO createReservation(ReservationRequestDTO dto) {
        User resident = residentRepository.findResidentById(dto.getResidentId())
                .orElseThrow(() -> new ResourceNotFoundException("Resident not found or does not have the RESIDENT role: " + dto.getResidentId()));


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
                startDate = LocalDateTime.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).toLocalDate().atStartOfDay();
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

}
