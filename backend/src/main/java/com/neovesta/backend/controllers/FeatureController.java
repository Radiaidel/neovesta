package com.neovesta.backend.controllers;

import com.neovesta.backend.dtos.request.FeatureRequest;
import com.neovesta.backend.dtos.response.FeatureResponse;
import com.neovesta.backend.services.FeatureService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/features")
@Validated
public class FeatureController {
    private final FeatureService featureService;

    public FeatureController(FeatureService featureService) {
        this.featureService = featureService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('RESIDENCE_MANAGER', 'SUB_RESIDENCE_MANAGER')")
    public ResponseEntity<FeatureResponse> createFeature(@Valid @RequestBody FeatureRequest featureRequest) throws BadRequestException {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(featureService.createFeature(featureRequest));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RESIDENCE_MANAGER', 'SUB_RESIDENCE_MANAGER')")
    public ResponseEntity<FeatureResponse> updateFeature(
            @PathVariable UUID id,
            @Valid @RequestBody FeatureRequest featureRequest) {
        return ResponseEntity.ok(featureService.updateFeature(id, featureRequest));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('RESIDENCE_MANAGER', 'SUB_RESIDENCE_MANAGER')")
    public ResponseEntity<Void> deleteFeature(@PathVariable UUID id) {
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