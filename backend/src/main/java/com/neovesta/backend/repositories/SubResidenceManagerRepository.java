package com.neovesta.backend.repositories;

import com.neovesta.backend.models.SubResidenceManager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SubResidenceManagerRepository extends JpaRepository<SubResidenceManager, UUID> {
    List<SubResidenceManager> findByManagerId(UUID managerId);
}
