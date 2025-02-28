package com.neovesta.backend.exceptions;

import java.util.UUID;

public class SubscriptionNotFoundException extends RuntimeException {
    public SubscriptionNotFoundException(UUID subscriptionId) {
        super("Subscription not found with ID: " + subscriptionId);
    }
}