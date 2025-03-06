package com.neovesta.backend.services;

import com.neovesta.backend.dtos.request.CreateResidenceRequest;
import com.neovesta.backend.dtos.request.UpdateResidenceRequest;
import com.neovesta.backend.dtos.response.PageResponse;
import com.neovesta.backend.dtos.response.ResidenceResponse;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.util.UUID;

public interface ResidenceService {
    ResidenceResponse createResidence(CreateResidenceRequest request) throws IOException;
    ResidenceResponse updateResidence(UUID id, UpdateResidenceRequest request) throws IOException;
    ResidenceResponse getResidenceById(UUID id);
    ResidenceResponse getResidenceByManagerId(UUID managerId);
    PageResponse<ResidenceResponse> getAllResidences(String search, String[] amenities,
                                                     Double minPrice, Double maxPrice,
                                                     String city, Pageable pageable);
    void deleteResidence(UUID id) throws IOException;

    PageResponse<String> getAllCities(Pageable pageable);
    PageResponse<ResidenceResponse> searchByNameOrManagerName(String search, Pageable pageable);
    PageResponse<ResidenceResponse> findByCity(String city, Pageable pageable);
}