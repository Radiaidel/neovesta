package com.neovesta.backend.repositories;

import com.neovesta.backend.models.Residence;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResidenceRepository extends JpaRepository<Residence, UUID>, JpaSpecificationExecutor<Residence> {
    Optional<Residence> findByManagerId(UUID managerId);


    @Query("SELECT r FROM Residence r WHERE " +
            "LOWER(r.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(r.manager.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(r.manager.lastName) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Residence> searchByNameOrManagerName(@Param("search") String search, Pageable pageable);

    @Query("SELECT DISTINCT r FROM Residence r " +
            "WHERE LOWER(r.address.city) = LOWER(:city)")
    Page<Residence> findByCity(@Param("city") String city, Pageable pageable);

    @Query("SELECT DISTINCT r.address.city FROM Residence r")
    Page<String> findAllCities(Pageable pageable);
}