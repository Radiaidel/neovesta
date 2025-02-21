package com.neovesta.backend.models.enums;

public enum SubscriptionStatus {
    PENDING, // En attente de validation
    ACTIVE, // Approuvé et en cours
    CANCELED, // Résilié
    REFUSED // Refusé avec une note
}
