package com.neovesta.backend.services.impl;

import com.neovesta.backend.dtos.request.FeatureRequest;
import com.neovesta.backend.dtos.response.FeatureResponse;
import com.neovesta.backend.exceptions.FeatureException;
import com.neovesta.backend.exceptions.ResourceNotFoundException;
import com.neovesta.backend.mappers.FeatureMapper;
import com.neovesta.backend.models.Feature;
import com.neovesta.backend.models.Residence;
import com.neovesta.backend.repositories.FeatureRepository;
import com.neovesta.backend.repositories.ResidenceRepository;
import com.neovesta.backend.services.FeatureService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class FeatureServiceImpl implements FeatureService {
    private final FeatureRepository featureRepository;
    private final FeatureMapper featureMapper;
    private final ResidenceRepository residenceRepository;


    public FeatureServiceImpl(FeatureRepository featureRepository, FeatureMapper featureMapper, ResidenceRepository residenceRepository) {
        this.featureRepository = featureRepository;
        this.featureMapper = featureMapper;
        this.residenceRepository = residenceRepository;
    }

    @Override
    public FeatureResponse createFeature(FeatureRequest featureRequest) {
        validateFeatureRequest(featureRequest);

        Residence residence = residenceRepository.findById(featureRequest.getResidenceId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("Residence not found with ID: %s", featureRequest.getResidenceId())
                ));

        Feature feature = featureMapper.toEntity(featureRequest);
        feature.setResidence(residence);

        Feature savedFeature = featureRepository.save(feature);
        return featureMapper.toResponse(savedFeature);
    }

    @Override
    public FeatureResponse updateFeature(UUID id, FeatureRequest featureRequest) {
        validateFeatureRequest(featureRequest);

        Feature feature = featureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("Feature not found with ID: %s", id)
                ));

        if (!feature.getResidence().getId().equals(featureRequest.getResidenceId())) {
            throw new FeatureException("Cannot change the residence of an existing feature");
        }

        featureMapper.updateEntity(featureRequest, feature);
        return featureMapper.toResponse(featureRepository.save(feature));
    }

    @Override
    public void deleteFeature(UUID id) {
        if (!featureRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    String.format("Feature not found with ID: %s", id)
            );
        }
        featureRepository.deleteById(id);
    }

    @Override
    public FeatureResponse getFeatureById(UUID id) {
        return featureRepository.findById(id)
                .map(featureMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("Feature not found with ID: %s", id)
                ));
    }

    @Override
    public Page<FeatureResponse> getFeaturesByResidence(String residenceName, Pageable pageable) {
        if (residenceName == null || residenceName.trim().isEmpty()) {
            throw new FeatureException("Residence name cannot be empty");
        }

        return featureRepository.findByResidence_NameContainingIgnoreCase(residenceName, pageable)
                .map(featureMapper::toResponse);
    }

    private void validateFeatureRequest(FeatureRequest request) {
        if (request == null) {
            throw new FeatureException("Feature request cannot be null");
        }

        if (request.getResidenceId() == null) {
            throw new FeatureException("Residence ID is required");
        }

        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new FeatureException("Feature name is required");
        }

        if (request.getFeatureType() == null) {
            throw new FeatureException("Feature type is required");
        }

        if (request.getFeatureCategory() == null) {
            throw new FeatureException("Feature category is required");
        }
    }
}