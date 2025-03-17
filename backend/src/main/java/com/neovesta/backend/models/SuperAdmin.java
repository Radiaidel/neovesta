package com.neovesta.backend.models;

import com.neovesta.backend.models.enums.Role;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "super_admins")
@SuperBuilder
@NoArgsConstructor
@PrimaryKeyJoinColumn(name = "id")
@DiscriminatorValue("SUPER_ADMIN")
public class SuperAdmin extends User {
    
    @Override
    public void setRole(Role role) {
        super.setRole(Role.SUPER_ADMIN);
    }
}
