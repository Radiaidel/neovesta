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
@Table(name = "admins")
@SuperBuilder
@NoArgsConstructor
@DiscriminatorValue("ADMIN")
public class Admin extends User {

    @PrePersist
    @PreUpdate
    @Override
    public void setRole(Role role) {
        super.setRole(Role.ADMIN);
    }
}
