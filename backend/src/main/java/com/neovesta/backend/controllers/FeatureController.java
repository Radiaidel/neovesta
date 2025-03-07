package com.neovesta.backend.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.neovesta.backend.dtos.request.FeatureRequest;
import com.neovesta.backend.dtos.response.FeatureResponse;
import com.neovesta.backend.services.FeatureService;
import jakarta.validation.constraints.NotBlank;

import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/features")
@Validated
public class FeatureController {
    private final FeatureService featureService;

    public FeatureController(FeatureService featureService) {
        this.featureService = featureService;
    }

    @GetMapping
    public ResponseEntity<Page<FeatureResponse>> getAllFeatures(
            @RequestParam(required = false) String residenceName,
            @RequestParam(required = false) String featureType,
            @RequestParam(required = false) String featureCategory,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "created_at") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = Sort.by(sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        return ResponseEntity.ok(featureService.getAllFeatures(
                residenceName,
                featureType,
                featureCategory,
                active,
                search,
                pageable));
    }

    @PostMapping(consumes = { MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasAnyRole('RESIDENCE_MANAGER', 'SUB_RESIDENCE_MANAGER')")
    public ResponseEntity<FeatureResponse> createFeature(
            @RequestPart(value = "feature") String featureRequestJson,
            @RequestPart(value = "image", required = false) MultipartFile image)
            throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        FeatureRequest featureRequest = objectMapper.readValue(featureRequestJson, FeatureRequest.class);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(featureService.createFeature(featureRequest, image));
    }

    @PutMapping(value = "/{id}", consumes = { MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasAnyRole('RESIDENCE_MANAGER', 'SUB_RESIDENCE_MANAGER')")
    public ResponseEntity<FeatureResponse> updateFeature(
            @PathVariable UUID id,
            @RequestPart(value = "feature") String featureRequestJson,
            @RequestPart(value = "image", required = false) MultipartFile image)
            throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        FeatureRequest featureRequest = objectMapper.readValue(featureRequestJson, FeatureRequest.class);
        return ResponseEntity.ok(featureService.updateFeature(id, featureRequest, image));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('RESIDENCE_MANAGER', 'SUB_RESIDENCE_MANAGER')")
    public ResponseEntity<Void> deleteFeature(@PathVariable UUID id) throws IOException {
        featureService.deleteFeature(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeatureResponse> getFeatureById(@PathVariable UUID id) {
        return ResponseEntity.ok(featureService.getFeatureById(id));
    }

    @GetMapping("/by-residence")
    @PreAuthorize("hasAnyRole('RESIDENCE_MANAGER', 'SUB_RESIDENCE_MANAGER')")
    public ResponseEntity<Page<FeatureResponse>> getFeaturesByResidence(
            @RequestParam @NotBlank(message = "Residence name is required") String residenceName,
            Pageable pageable) throws BadRequestException {
        return ResponseEntity.ok(featureService.getFeaturesByResidence(residenceName, pageable));
    }
}