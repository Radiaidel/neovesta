package com.neovesta.backend.controllers;

import com.neovesta.backend.dtos.request.ContractRequest;
import com.neovesta.backend.dtos.response.ContractResponse;
import com.neovesta.backend.services.ContractService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/contracts")
@RequiredArgsConstructor
public class ContractController {

    private final ContractService contractService;

    @PostMapping
    @PreAuthorize("hasAnyRole('RESIDENCE_MANAGER', 'SUB_RESIDENCE_MANAGER')")
    public ResponseEntity<ContractResponse> createContract(@Valid @RequestBody ContractRequest request) {
        return new ResponseEntity<>(contractService.createContract(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RESIDENCE_MANAGER', 'SUB_RESIDENCE_MANAGER')")
    public ResponseEntity<ContractResponse> updateContract(@PathVariable UUID id, @Valid @RequestBody ContractRequest request) {
        return ResponseEntity.ok(contractService.updateContract(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('RESIDENCE_MANAGER', 'SUB_RESIDENCE_MANAGER')")
    public ResponseEntity<Void> deleteContract(@PathVariable UUID id) {
        contractService.deleteContract(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('RESIDENCE_MANAGER', 'SUB_RESIDENCE_MANAGER' , 'RESIDENT')")
    public ResponseEntity<ContractResponse> getContractById(@PathVariable UUID id) {
        return ResponseEntity.ok(contractService.getContractById(id));
    }

    @GetMapping("/resident/{residentId}")
    @PreAuthorize("hasAnyRole('RESIDENCE_MANAGER', 'SUB_RESIDENCE_MANAGER') or #residentId == authentication.principal.id")
    public ResponseEntity<Page<ContractResponse>> getContractsByResident(@PathVariable UUID residentId, Pageable pageable) {
        return ResponseEntity.ok(contractService.getContractsByResident(residentId, pageable));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('RESIDENCE_MANAGER', 'SUB_RESIDENCE_MANAGER')")
    public ResponseEntity<Page<ContractResponse>> getAllContracts(Pageable pageable) {
        return ResponseEntity.ok(contractService.getAllContracts(pageable));
    }

    //TODO : delete these functons cuz i'll just use update method
//    @PatchMapping("/{id}/renew")
//    @PreAuthorize("hasAnyRole('RESIDENCE_MANAGER', 'SUB_RESIDENCE_MANAGER')")
//    public ResponseEntity<ContractResponse> renewContract(@PathVariable UUID id, @RequestParam String newEndDate) {
//        return ResponseEntity.ok(contractService.renewContract(id, newEndDate));
//    }
//
//    @PatchMapping("/{id}/cancel")
//    @PreAuthorize("hasAnyRole('RESIDENCE_MANAGER', 'SUB_RESIDENCE_MANAGER')")
//    public ResponseEntity<Void> cancelContract(@PathVariable UUID id, @RequestParam String reason) {
//        contractService.cancelContract(id, reason);
//        return ResponseEntity.noContent().build();
//    }

    @GetMapping("/{id}/pdf")
    @PreAuthorize("hasAnyRole('RESIDENCE_MANAGER', 'SUB_RESIDENCE_MANAGER') or @contractAuthorizationService.isContractOwner(#id, authentication.principal.id)")
    public ResponseEntity<byte[]> generateContractPDF(@PathVariable UUID id) {
        byte[] pdfBytes = contractService.generateContractPDF(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", "contract-" + id + ".pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    @GetMapping("/export")
    @PreAuthorize("hasAnyRole('RESIDENCE_MANAGER', 'SUB_RESIDENCE_MANAGER')")
    public ResponseEntity<byte[]> exportContracts(@RequestParam String format) {
        byte[] exportBytes = contractService.exportContracts(format);

        HttpHeaders headers = new HttpHeaders();
        String contentType;
        String filename;

        switch (format.toLowerCase()) {
            case "csv":
                contentType = "text/csv";
                filename = "contracts.csv";
                break;
            case "excel":
                contentType = "application/vnd.ms-excel";
                filename = "contracts.xlsx";
                break;
            case "pdf":
                contentType = "application/pdf";
                filename = "contracts.pdf";
                break;
            default:
                contentType = "application/octet-stream";
                filename = "contracts.bin";
        }

        headers.setContentType(MediaType.parseMediaType(contentType));
        headers.setContentDispositionFormData("filename", filename);

        return new ResponseEntity<>(exportBytes, headers, HttpStatus.OK);
    }
}