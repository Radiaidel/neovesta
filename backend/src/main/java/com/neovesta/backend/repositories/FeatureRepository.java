package com.neovesta.backend.repositories;

import com.neovesta.backend.models.Feature;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FeatureRepository extends JpaRepository<Feature, UUID> {

    @Query(value = "SELECT f.* FROM residence_features f " +
         "JOIN residences r ON r.id = f.residence_id " +
         "WHERE (:residenceName IS NULL OR r.name::text ILIKE CONCAT('%', :residenceName, '%')) " +
         "AND (:featureType IS NULL OR f.feature_type = CAST(:featureType AS text)) " +
         "AND (:featureCategory IS NULL OR f.feature_category = CAST(:featureCategory AS text)) " +
         "AND (:active IS NULL OR f.active = :active) " +
         "AND (:search IS NULL OR f.name::text ILIKE CONCAT('%', :search, '%') OR f.description::text ILIKE CONCAT('%', :search, '%'))",
         countQuery = "SELECT COUNT(*) FROM residence_features f " +
         "JOIN residences r ON r.id = f.residence_id " +
         "WHERE (:residenceName IS NULL OR r.name::text ILIKE CONCAT('%', :residenceName, '%')) " +
         "AND (:featureType IS NULL OR f.feature_type = CAST(:featureType AS text)) " +
         "AND (:featureCategory IS NULL OR f.feature_category = CAST(:featureCategory AS text)) " +
         "AND (:active IS NULL OR f.active = :active) " +
         "AND (:search IS NULL OR f.name::text ILIKE CONCAT('%', :search, '%') OR f.description::text ILIKE CONCAT('%', :search, '%'))",
         nativeQuery = true)
    Page<Feature> findFeaturesByFilters(
         @Param("residenceName") String residenceName,
         @Param("featureType") String featureType,
         @Param("featureCategory") String featureCategory,
         @Param("active") Boolean active,
         @Param("search") String search,
         Pageable pageable);
    
    @Query(value = "SELECT f.* FROM residence_features f " +
         "JOIN residences r ON r.id = f.residence_id " +
         "WHERE r.name = :residenceName",
         countQuery = "SELECT COUNT(*) FROM residence_features f " +
         "JOIN residences r ON r.id = f.residence_id " +
         "WHERE r.name = :residenceName",
         nativeQuery = true)
    Page<Feature> findByResidenceName(@Param("residenceName") String residenceName, Pageable pageable);
}

