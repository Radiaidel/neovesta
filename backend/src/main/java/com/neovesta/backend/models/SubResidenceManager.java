package com.neovesta.backend.models;

import com.neovesta.backend.models.enums.Role;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "sub_residence_managers")
@SuperBuilder
@NoArgsConstructor
@Getter
@Setter
@DiscriminatorValue("SUB_RESIDENCE_MANAGER")
public class SubResidenceManager extends User {

    @ManyToOne
    @JoinColumn(name = "residence_manager_id")
    private ResidenceManager manager;

    
    @Override
    public void setRole(Role role) {
        super.setRole(Role.SUB_RESIDENCE_MANAGER);
    }
}
