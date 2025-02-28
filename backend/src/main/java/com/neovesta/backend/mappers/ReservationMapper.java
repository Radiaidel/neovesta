package com.neovesta.backend.mappers;

import com.neovesta.backend.dtos.request.ReservationRequestDTO;
import com.neovesta.backend.dtos.response.ReservationResponseDTO;
import com.neovesta.backend.models.Reservation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReservationMapper {
    @Mapping(source = "resident.id", target = "residentId")
    @Mapping(source = "feature.id", target = "featureId")
    ReservationResponseDTO toDTO(Reservation reservation);

    @Mapping(source = "residentId", target = "resident.id")
    @Mapping(source = "featureId", target = "feature.id")
    Reservation toEntity(ReservationRequestDTO dto);
}
