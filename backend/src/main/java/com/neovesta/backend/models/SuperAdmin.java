package com.neovesta.backend.models;

import com.neovesta.backend.models.enums.Role;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "super_admins")
@SuperBuilder
@NoArgsConstructor
@DiscriminatorValue("SUPER_ADMIN")
public class SuperAdmin extends User {
    @PrePersist
    @PreUpdate
    @Override
    public void setRole(Role role) {
        super.setRole(Role.SUPER_ADMIN);
    }
}
