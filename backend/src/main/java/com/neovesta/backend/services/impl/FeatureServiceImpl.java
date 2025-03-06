package com.neovesta.backend.services.impl;

import com.neovesta.backend.dtos.request.FeatureRequest;
import com.neovesta.backend.dtos.response.FeatureResponse;
import com.neovesta.backend.exceptions.FeatureException;
import com.neovesta.backend.exceptions.ResourceNotFoundException;
import com.neovesta.backend.mappers.FeatureMapper;
import com.neovesta.backend.models.Feature;
import com.neovesta.backend.models.Residence;
import com.neovesta.backend.models.enums.FeatureCategory;
import com.neovesta.backend.models.enums.FeatureType;
import com.neovesta.backend.repositories.FeatureRepository;
import com.neovesta.backend.repositories.ResidenceRepository;
import com.neovesta.backend.services.CloudinaryService;
import com.neovesta.backend.services.FeatureService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class FeatureServiceImpl implements FeatureService {

    private final FeatureRepository featureRepository;
    private final ResidenceRepository residenceRepository;
    private final FeatureMapper featureMapper;
    private final CloudinaryService cloudinaryService;

    @Override
    public FeatureResponse createFeature(FeatureRequest request, MultipartFile image) throws IOException {
        Residence residence = residenceRepository.findById(request.getResidenceId())
                .orElseThrow(() -> new ResourceNotFoundException("Residence not found with id: " + request.getResidenceId()));

        Feature feature = Feature.builder()
                .name(request.getName())
                .description(request.getDescription())
                .featureType(request.getFeatureType())
                .featureCategory(request.getFeatureCategory())
                .location(request.getLocation())
                .active(request.getActive())
                .termsAndConditions(request.getTermsAndConditions())
                .cancellationPolicy(request.getCancellationPolicy())
                .requiresManagerApproval(request.getRequiresManagerApproval())
                .residence(residence)
                .createdAt(LocalDateTime.now())
                .build();

        if (image != null && !image.isEmpty()) {
            String imageUrl = cloudinaryService.uploadImage(image);
            feature.setImageUrl(imageUrl);
        }

        Feature savedFeature = featureRepository.save(feature);
        
        return featureMapper.toResponse(savedFeature);
    }

    @Override
    public FeatureResponse updateFeature(UUID id, FeatureRequest request, MultipartFile image) throws IOException {
        Feature existingFeature = featureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feature not found with id: " + id));

        if (!existingFeature.getResidence().getId().equals(request.getResidenceId())) {
            Residence residence = residenceRepository.findById(request.getResidenceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Residence not found with id: " + request.getResidenceId()));
            existingFeature.setResidence(residence);
        }

        existingFeature.setName(request.getName());
        existingFeature.setDescription(request.getDescription());
        existingFeature.setFeatureType(request.getFeatureType());
        existingFeature.setFeatureCategory(request.getFeatureCategory());
        existingFeature.setLocation(request.getLocation());
        existingFeature.setActive(request.getActive());
        existingFeature.setTermsAndConditions(request.getTermsAndConditions());
        existingFeature.setCancellationPolicy(request.getCancellationPolicy());
        existingFeature.setRequiresManagerApproval(request.getRequiresManagerApproval());
        existingFeature.setUpdatedAt(LocalDateTime.now());

        if (image != null && !image.isEmpty()) {
            if (existingFeature.getImageUrl() != null && !existingFeature.getImageUrl().isEmpty()) {
                cloudinaryService.deleteImage(existingFeature.getImageUrl());
            }
            
            String imageUrl = cloudinaryService.uploadImage(image);
            existingFeature.setImageUrl(imageUrl);
        }

        Feature updatedFeature = featureRepository.save(existingFeature);
        
        return featureMapper.toResponse(updatedFeature);
    }

    @Override
    public void deleteFeature(UUID id) throws IOException {
        Feature feature = featureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feature not found with id: " + id));

        if (feature.getImageUrl() != null && !feature.getImageUrl().isEmpty()) {
            cloudinaryService.deleteImage(feature.getImageUrl());
        }

        featureRepository.delete(feature);
    }

    @Override
    public FeatureResponse getFeatureById(UUID id) {
        Feature feature = featureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feature not found with id: " + id));
        return featureMapper.toResponse(feature);
    }

    @Override
    public Page<FeatureResponse> getAllFeatures(
            String residenceName, String featureType, String featureCategory,
            Boolean active, String search, Pageable pageable) {
        
        Pageable adjustedPageable = adjustPageableForSnakeCase(pageable);
        
        FeatureType typeEnum = null;
        if (featureType != null && !featureType.trim().isEmpty()) {
            try {
                typeEnum = FeatureType.valueOf(featureType.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new FeatureException("Invalid feature type: " + featureType);
            }
        }

        FeatureCategory categoryEnum = null;
        if (featureCategory != null && !featureCategory.trim().isEmpty()) {
            try {
                categoryEnum = FeatureCategory.valueOf(featureCategory.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new FeatureException("Invalid feature category: " + featureCategory);
            }
        }

        String cleanResidenceName = (residenceName != null && !residenceName.trim().isEmpty()) ? residenceName.trim() : null;
        String cleanSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;

        String featureTypeStr = featureType != null ? featureType : null;
        String featureCategoryStr = featureCategory != null ? featureCategory : null;
        
        Page<Feature> features = featureRepository.findFeaturesByFilters(
                cleanResidenceName,
                featureTypeStr,
                featureCategoryStr,
                active,
                cleanSearch,
                adjustedPageable);

        return features.map(featureMapper::toResponse);
    }

    @Override
    public Page<FeatureResponse> getFeaturesByResidence(String residenceName, Pageable pageable) throws BadRequestException {
        if (residenceName == null || residenceName.trim().isEmpty()) {
            throw new BadRequestException("Residence name is required");
        }
        
        Pageable adjustedPageable = adjustPageableForSnakeCase(pageable);
        Page<Feature> features = featureRepository.findByResidenceName(residenceName, adjustedPageable);
        return features.map(featureMapper::toResponse);
    }

    private Pageable adjustPageableForSnakeCase(Pageable pageable) {
        if (pageable.getSort().isUnsorted()) {
            return pageable;
        }
        
        List<Sort.Order> adjustedOrders = new ArrayList<>();
        
        for (Sort.Order order : pageable.getSort()) {
            String property = order.getProperty();
            
            if ("createdAt".equals(property)) {
                property = "created_at";
            } else if ("updatedAt".equals(property)) {
                property = "updated_at";
            } else if ("featureType".equals(property)) {
                property = "feature_type";
            } else if ("featureCategory".equals(property)) {
                property = "feature_category";
            } else if ("imageUrl".equals(property)) {
                property = "image_url";
            } else if ("termsAndConditions".equals(property)) {
                property = "terms_and_conditions";
            } else if ("cancellationPolicy".equals(property)) {
                property = "cancellation_policy";
            } else if ("requiresManagerApproval".equals(property)) {
                property = "requires_manager_approval";
            }
            
            adjustedOrders.add(new Sort.Order(order.getDirection(), property));
        }
        
        return PageRequest.of(
            pageable.getPageNumber(),
            pageable.getPageSize(),
            Sort.by(adjustedOrders)
        );
    }
}

