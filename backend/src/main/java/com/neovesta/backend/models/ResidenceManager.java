package com.neovesta.backend.models;

import com.neovesta.backend.models.enums.Role;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
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
public class ResidenceManager extends User {

    @OneToOne
    @JoinColumn(name = "residence_id")
    private Residence residence;
    @Override
    public void setRole(Role role) {
        super.setRole(Role.RESIDENCE_MANAGER);
    }

}
