package com.neovesta.backend.repositories;

import com.neovesta.backend.models.Feature;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FeatureRepository extends JpaRepository<Feature, UUID> {
    Page<Feature> findByResidence_NameContainingIgnoreCase(String residenceName, Pageable pageable);
}
