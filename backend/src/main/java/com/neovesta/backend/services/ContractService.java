package com.neovesta.backend.services;

import com.neovesta.backend.dtos.request.ContractRequest;
import com.neovesta.backend.dtos.response.ContractResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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
}
