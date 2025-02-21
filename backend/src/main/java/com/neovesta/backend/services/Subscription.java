package com.neovesta.backend.services;

import com.neovesta.backend.models.enums.SubscriptionPeriod;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface Subscription {
    public Subscription requestSubscription(UUID residentId, UUID featureId, SubscriptionPeriod period);
    public Subscription confirmSubscription(UUID subscriptionId, LocalDate startDate, UUID adminId);
    public Subscription refuseSubscription(UUID subscriptionId, String adminNote, UUID adminId);
    public List<Subscription> getSubscriptionsByResident(UUID residentId, Pageable pageable);
    public List<Subscription> getPendingSubscriptions(Pageable pageable);
}
