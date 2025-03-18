package com.neovesta.backend.models;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.neovesta.backend.models.enums.Role;

import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
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
@PrimaryKeyJoinColumn(name = "id")
@DiscriminatorValue("RESIDENCE_MANAGER")
@OnDelete(action = OnDeleteAction.CASCADE)
public class ResidenceManager extends User {


    @OneToOne
    @JoinColumn(name = "residence_id")
    private Residence residence;

    @OneToMany(mappedBy = "manager", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SubResidenceManager> subManagers = new ArrayList<>();

    @Override
    public void setRole(Role role) {
        super.setRole(Role.RESIDENCE_MANAGER);
    }
}