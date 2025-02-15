package com.neovesta.backend.repositories;

import com.neovesta.backend.models.ResidenceManager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ResidenceManagerRepository extends JpaRepository<ResidenceManager, UUID> {
}