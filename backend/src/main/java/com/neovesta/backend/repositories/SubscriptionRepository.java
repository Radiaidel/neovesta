package com.neovesta.backend.repositories;

import com.neovesta.backend.models.Subscription;
import com.neovesta.backend.models.enums.PaymentStatus;
import com.neovesta.backend.models.enums.SubscriptionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {

    List<Subscription> findByUserId(UUID userId);

    List<Subscription> findByFeatureId(UUID serviceId);

    List<Subscription> findByIsActiveTrue();

    List<Subscription> findByIsConfirmedByAdminTrue();

    List<Subscription> findByStartDateBetween(LocalDate start, LocalDate end);
}
