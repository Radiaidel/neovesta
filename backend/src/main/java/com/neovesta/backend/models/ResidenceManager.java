package com.neovesta.backend.models;

import com.neovesta.backend.models.enums.Role;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "residence_managers")
@SuperBuilder
@NoArgsConstructor
public class ResidenceManager extends User {
    @Override
    public void setRole(Role role) {
        super.setRole(Role.RESIDENCE_MANAGER);
    }
}
