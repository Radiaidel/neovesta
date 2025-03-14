package com.neovesta.backend.models;

import java.util.ArrayList;
import java.util.List;

import com.neovesta.backend.models.enums.Role;

import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Setter
@Getter
@Entity
@Table(name = "residence_managers")
@SuperBuilder
@NoArgsConstructor
@DiscriminatorValue("RESIDENCE_MANAGER")
public class ResidenceManager extends User {

    @OneToOne
    @JoinColumn(name = "residence_id")
    private Residence residence;

    @OneToMany(mappedBy = "manager", cascade = CascadeType.ALL)
    @Builder.Default
    private List<SubResidenceManager> subManagers = new ArrayList<>();

    @PrePersist
    @PreUpdate
    @Override
    public void setRole(Role role) {
        super.setRole(Role.RESIDENCE_MANAGER);
    }
}