package com.neovesta.backend.repositories;

import com.neovesta.backend.models.Subscription;
import com.neovesta.backend.models.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, UUID>, JpaSpecificationExecutor<Subscription> {
    List<Subscription> findByUserId(UUID userId);
    List<Subscription> findByFeatureId(UUID featureId);
    List<Subscription> findByIsActiveTrue();
    List<Subscription> findByIsConfirmedByAdminTrue();
    List<Subscription> findByStartDateBetween(LocalDate start, LocalDate end);
    List<Subscription> findByUserIdAndIsActiveTrue(UUID userId);
    List<Subscription> findByUserIdAndIsConfirmedByAdminTrue(UUID userId);
    List<Subscription> findByUserIdAndStartDateBetween(UUID userId, LocalDate start, LocalDate end);
    List<Subscription> findByIsActiveTrueAndFeatureResidenceIdIn(List<UUID> residenceIds);
    List<Subscription> findByIsConfirmedByAdminTrueAndFeatureResidenceIdIn(List<UUID> residenceIds);
    List<Subscription> findByStartDateBetweenAndFeatureResidenceIdIn(LocalDate start, LocalDate end, List<UUID> residenceIds);
    Page<Subscription> findByUser(User user, Pageable pageable);
    @SuppressWarnings("null")
    Page<Subscription> findAll(Specification<Subscription> spec, Pageable pageable);
    Page<Subscription> findByFeatureResidenceId(UUID residenceId, Pageable pageable);
}

