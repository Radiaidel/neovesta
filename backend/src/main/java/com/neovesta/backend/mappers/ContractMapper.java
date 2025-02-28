package com.neovesta.backend.mappers;

import com.neovesta.backend.dtos.response.ContractResponse;
import com.neovesta.backend.models.Contract;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ContractMapper {

    @Mapping(target = "residentId", source = "resident.id")
    @Mapping(target = "residenceId", source = "residence.id")
    @Mapping(target = "durationInMonths", expression = "java(contract.getDurationInMonths())")
    @Mapping(target = "remainingAmount", expression = "java(contract.getRemainingAmount())")
    ContractResponse toResponse(Contract contract);
}
