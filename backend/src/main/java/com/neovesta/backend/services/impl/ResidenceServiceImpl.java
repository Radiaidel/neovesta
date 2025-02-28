package com.neovesta.backend.services.impl;

import com.neovesta.backend.dtos.request.CreateResidenceRequest;
import com.neovesta.backend.dtos.request.UpdateResidenceRequest;
import com.neovesta.backend.dtos.response.PageResponse;
import com.neovesta.backend.dtos.response.ResidenceResponse;
import com.neovesta.backend.exceptions.ResidenceNotFoundException;
import com.neovesta.backend.exceptions.UserNotFoundException;
import com.neovesta.backend.mappers.ResidenceMapper;
import com.neovesta.backend.models.Residence;
import com.neovesta.backend.models.ResidenceManager;
import com.neovesta.backend.repositories.ResidenceManagerRepository;
import com.neovesta.backend.repositories.ResidenceRepository;
import com.neovesta.backend.services.ResidenceService;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ResidenceServiceImpl implements ResidenceService {

    private final ResidenceRepository residenceRepository;
    private final ResidenceManagerRepository residenceManagerRepository;
    private final ResidenceMapper residenceMapper;

    public ResidenceServiceImpl(ResidenceRepository residenceRepository, ResidenceManagerRepository residenceManagerRepository, ResidenceMapper residenceMapper) {
        this.residenceRepository = residenceRepository;
        this.residenceManagerRepository = residenceManagerRepository;
        this.residenceMapper = residenceMapper;
    }

    @Override
    @Transactional
    public ResidenceResponse createResidence(CreateResidenceRequest request) {
        Residence residence = residenceMapper.toEntity(request);

        if (request.getManagerId() != null) {
            ResidenceManager manager = residenceManagerRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new UserNotFoundException("Residence manager not found"));
            residence.setManager(manager);
            manager.setResidence(residence);
        }

        residence = residenceRepository.save(residence);
        return residenceMapper.toResponse(residence);
    }

    @Override
    @Transactional
    public ResidenceResponse updateResidence(UUID id, UpdateResidenceRequest request) {
        Residence residence = residenceRepository.findById(id)
                .orElseThrow(() -> new ResidenceNotFoundException("Residence not found"));

        residenceMapper.updateEntityFromRequest(residence, request);
        residence = residenceRepository.save(residence);
        return residenceMapper.toResponse(residence);
    }

    @Override
    public ResidenceResponse getResidenceById(UUID id) {
        Residence residence = residenceRepository.findById(id)
                .orElseThrow(() -> new ResidenceNotFoundException("Residence not found"));
        return residenceMapper.toResponse(residence);
    }

    @Override
    public ResidenceResponse getResidenceByManagerId(UUID managerId) {
        Residence residence = residenceRepository.findByManagerId(managerId)
                .orElseThrow(() -> new ResidenceNotFoundException("Residence not found for this manager"));
        return residenceMapper.toResponse(residence);
    }

    @Override
    public PageResponse<ResidenceResponse> getAllResidences(
            String search, String[] amenities, Double minPrice, Double maxPrice,
            String city, Pageable pageable) {

        Specification<Residence> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.trim().isEmpty()) {
                String searchLike = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), searchLike),
                        cb.like(cb.lower(root.get("description")), searchLike)
                ));
            }

            if (amenities != null && amenities.length > 0) {
                predicates.add(root.join("amenities").in(amenities));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("startingPrice"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("startingPrice"), maxPrice));
            }

            if (city != null && !city.trim().isEmpty()) {
                predicates.add(cb.equal(cb.lower(root.get("address").get("city")),
                        city.toLowerCase()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<ResidenceResponse> page = residenceRepository.findAll(spec, pageable)
                .map(residenceMapper::toResponse);

        return new PageResponse<>(page);
    }

    @Override
    @Transactional
    public void deleteResidence(UUID id) {
        Residence residence = residenceRepository.findById(id)
                .orElseThrow(() -> new ResidenceNotFoundException("Residence not found with id: " + id));

        if (residence.getManager() != null) {
            ResidenceManager manager = residence.getManager();
            manager.setResidence(null);
            residenceManagerRepository.save(manager);
            residence.setManager(null);
        }

        residence.getImageUrls().clear();
        residence.getAmenities().clear();
        residence.getDocuments().clear();

        residenceRepository.delete(residence);
    }

    @Override
    public PageResponse<String> getAllCities(Pageable pageable) {
        Page<String> cities = residenceRepository.findAllCities(pageable);
        return new PageResponse<>(cities);
    }

    @Override
    public PageResponse<ResidenceResponse> searchByNameOrManagerName(String search, Pageable pageable) {
        Page<Residence> residences = residenceRepository.searchByNameOrManagerName(search, pageable);
        return new PageResponse<>(residences.map(residenceMapper::toResponse));
    }

    @Override
    public PageResponse<ResidenceResponse> findByCity(String city, Pageable pageable) {
        Page<Residence> residences = residenceRepository.findByCity(city, pageable);
        return new PageResponse<>(residences.map(residenceMapper::toResponse));
    }
}

