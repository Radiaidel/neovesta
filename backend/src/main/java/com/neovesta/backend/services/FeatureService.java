package com.neovesta.backend.services;

import com.neovesta.backend.dtos.request.FeatureRequest;
import com.neovesta.backend.dtos.response.FeatureResponse;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

public interface FeatureService {
    
    /**
     * Create a new feature with optional image
     * 
     * @param request The feature request data
     * @param image Optional image file to upload
     * @return The created feature response
     * @throws IOException If there's an error uploading the image
     */
    FeatureResponse createFeature(FeatureRequest request, MultipartFile image) throws IOException;
    
    /**
     * Update an existing feature with optional new image
     * 
     * @param id The ID of the feature to update
     * @param request The updated feature data
     * @param image Optional new image file to upload
     * @return The updated feature response
     * @throws IOException If there's an error uploading the image
     */
    FeatureResponse updateFeature(UUID id, FeatureRequest request, MultipartFile image) throws IOException;
    
    /**
     * Delete a feature and its associated image
     * 
     * @param id The ID of the feature to delete
     * @throws IOException If there's an error deleting the image
     */
    void deleteFeature(UUID id) throws IOException;
    
    /**
     * Get a feature by its ID
     * 
     * @param id The ID of the feature to retrieve
     * @return The feature response
     */
    FeatureResponse getFeatureById(UUID id);
    
    /**
     * Get all features with optional filtering
     * 
     * @param residenceName Optional residence name filter
     * @param featureType Optional feature type filter
     * @param featureCategory Optional feature category filter
     * @param active Optional active status filter
     * @param search Optional search term for name or description
     * @param pageable Pagination and sorting information
     * @return A page of feature responses
     */
    Page<FeatureResponse> getAllFeatures(
            String residenceName,
            String featureType,
            String featureCategory,
            Boolean active,
            String search,
            Pageable pageable);
    
    /**
     * Get features by residence name
     * 
     * @param residenceName The name of the residence
     * @param pageable Pagination and sorting information
     * @return A page of feature responses
     * @throws BadRequestException If the residence name is invalid
     */
    Page<FeatureResponse> getFeaturesByResidence(String residenceName, Pageable pageable) throws BadRequestException;
}

