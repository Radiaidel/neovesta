package com.neovesta.backend.models.enums;

public enum Role {
    SUPER_ADMIN,       // Manage neovesta
    ADMIN,             // Manage Residences & RESIDENCE_MANAGER
    RESIDENCE_MANAGER, // Manage his own residence
    SUB_RESIDENCE_MANAGER, // manage the residents
    RESIDENT           
}
