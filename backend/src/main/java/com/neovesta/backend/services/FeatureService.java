package com.neovesta.backend.services;

import com.neovesta.backend.dtos.request.FeatureRequest;
import com.neovesta.backend.dtos.response.FeatureResponse;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface FeatureService {
    FeatureResponse createFeature(FeatureRequest request) throws BadRequestException;
    FeatureResponse updateFeature(UUID id, FeatureRequest request);
    void deleteFeature(UUID id);
    FeatureResponse getFeatureById(UUID id);
     Page<FeatureResponse> getFeaturesByResidence(String residenceName, Pageable pageable) throws BadRequestException;
}