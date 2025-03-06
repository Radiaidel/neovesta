package com.neovesta.backend.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.neovesta.backend.dtos.request.CreateResidenceRequest;
import com.neovesta.backend.dtos.request.DocumentUploadRequest;
import com.neovesta.backend.dtos.request.UpdateResidenceRequest;
import com.neovesta.backend.dtos.response.PageResponse;
import com.neovesta.backend.dtos.response.ResidenceResponse;
import com.neovesta.backend.services.ResidenceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/residences")
@RequiredArgsConstructor
public class ResidenceController {

    private final ResidenceService residenceService;
  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResidenceResponse> createResidence(
        @Valid @RequestPart("data") String requestJson,
        @RequestPart(value = "images", required = false) List<MultipartFile> images,
        @RequestPart(value = "documents", required = false) List<MultipartFile> documentFiles
    ) throws IOException {
        // Convertir le JSON en objet CreateResidenceRequest
        ObjectMapper objectMapper = new ObjectMapper();
        CreateResidenceRequest request = objectMapper.readValue(requestJson, CreateResidenceRequest.class);
        
        // Définir les images et documents
        request.setImages(images);
        
        // Convertir les fichiers en DocumentUploadRequest
        List<DocumentUploadRequest> documents = documentFiles != null 
            ? documentFiles.stream()
                .map(file ->DocumentUploadRequest.builder().name(file.getOriginalFilename()).file(file).type(file.getContentType()).build())
                .collect(Collectors.toList())
            : null;
        
        request.setDocuments(documents);
       
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(residenceService.createResidence(request));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResidenceResponse> updateResidence(
        @PathVariable UUID id,
        @Valid @RequestPart("data") String requestJson,
        @RequestPart(value = "images", required = false) List<MultipartFile> images,
        @RequestPart(value = "documents", required = false) List<MultipartFile> documentFiles
    ) throws IOException {
        // Convertir le JSON en objet UpdateResidenceRequest
        ObjectMapper objectMapper = new ObjectMapper();
        UpdateResidenceRequest request = objectMapper.readValue(requestJson, UpdateResidenceRequest.class);
        
        // Définir les images et documents
        request.setImages(images);
        
        // Convertir les fichiers en DocumentUploadRequest
        List<DocumentUploadRequest> documents = documentFiles != null
            ? documentFiles.stream()
                .map(file ->  DocumentUploadRequest.builder().name(file.getOriginalFilename()).file(file).type(file.getContentType()).build())
                .collect(Collectors.toList())
            : null;
        
        request.setDocuments(documents);
       
        return ResponseEntity.ok(residenceService.updateResidence(id, request));
    }
    // @PostMapping
    // @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    // public ResponseEntity<ResidenceResponse> createResidence(
    //         @Valid @RequestBody CreateResidenceRequest request) {
    //     return ResponseEntity.ok(residenceService.createResidence(request));
    // }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<PageResponse<ResidenceResponse>> getAllResidences(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String[] amenities,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String city,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort.Direction direction = Sort.Direction.fromString(sortDir.toUpperCase());
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(direction, sortBy));

        return ResponseEntity.ok(residenceService.getAllResidences(
                search, amenities, minPrice, maxPrice, city, pageRequest));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'RESIDENCE_MANAGER', 'SUB_RESIDENCE_MANAGER')")
    public ResponseEntity<ResidenceResponse> getResidence(@PathVariable UUID id) {
        return ResponseEntity.ok(residenceService.getResidenceById(id));
    }

    @GetMapping("/manager/{managerId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'RESIDENCE_MANAGER', 'SUB_RESIDENCE_MANAGER')")
    public ResponseEntity<ResidenceResponse> getResidenceByManager(@PathVariable UUID managerId) {
        return ResponseEntity.ok(residenceService.getResidenceByManagerId(managerId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RESIDENCE_MANAGER', 'SUB_RESIDENCE_MANAGER', 'ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ResidenceResponse> updateResidence(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateResidenceRequest request) throws IOException {
        return ResponseEntity.ok(residenceService.updateResidence(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('RESIDENCE_MANAGER', 'SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> deleteResidence(@PathVariable UUID id) throws IOException {
        residenceService.deleteResidence(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/cities")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<PageResponse<String>> getAllCities(Pageable pageable) {
        PageResponse<String> citiesPage = residenceService.getAllCities(pageable);
        return ResponseEntity.ok(citiesPage);
    }
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<PageResponse<ResidenceResponse>> searchResidences(
            @RequestParam String query,
            Pageable pageable) {
        PageResponse<ResidenceResponse> residencesPage = residenceService.searchByNameOrManagerName(query, pageable);
        return ResponseEntity.ok(residencesPage);
    }
    @GetMapping("/city/{city}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<PageResponse<ResidenceResponse>> getResidencesByCity(
            @PathVariable String city,
            Pageable pageable) {
        PageResponse<ResidenceResponse> residencesPage = residenceService.findByCity(city, pageable);
        return ResponseEntity.ok(residencesPage);
    }

}

