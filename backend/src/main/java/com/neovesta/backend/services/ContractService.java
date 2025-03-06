package com.neovesta.backend.services;

import com.neovesta.backend.dtos.request.ContractRequest;
import com.neovesta.backend.dtos.response.ContractResponse;
import com.neovesta.backend.models.enums.ContractStatus;
import com.neovesta.backend.models.enums.ContractType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.UUID;

public interface ContractService {
    ContractResponse createContract(ContractRequest request);
    ContractResponse updateContract(UUID id, ContractRequest request);
    void deleteContract(UUID id);
    ContractResponse getContractById(UUID id);
    Page<ContractResponse> getContractsByResident(UUID residentId, Pageable pageable);
    Page<ContractResponse> getAllContracts(Pageable pageable);
    byte[] generateContractPDF(UUID id);

    byte[] exportContracts(String format);
    Page<ContractResponse> getAllContractsWithFilters(
    UUID residentId, UUID residenceId, ContractType contractType, ContractStatus status,
    LocalDate startDateFrom, LocalDate startDateTo, LocalDate endDateFrom, LocalDate endDateTo,
    Pageable pageable);
}
