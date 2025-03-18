
package com.neovesta.backend.models;

import com.neovesta.backend.models.enums.ResidenceStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@Entity
@Table(name = "residences")
public class Residence {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ElementCollection
    @CollectionTable(name = "residence_images", joinColumns = @JoinColumn(name = "residence_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();

    @Embedded
    private Address address;

    private Integer totalApartments;
    private Integer availableApartments;

    @Column(precision = 10, scale = 2)
    private BigDecimal startingPrice;

    @ElementCollection
    @CollectionTable(name = "residence_amenities", joinColumns = @JoinColumn(name = "residence_id"))
    @Column(name = "amenity")
    private List<String> amenities = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "residence_documents", joinColumns = @JoinColumn(name = "residence_id"))
    private List<Document> documents = new ArrayList<>();

    @OneToMany(mappedBy = "residence", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Feature> features = new ArrayList<>();

    @OneToMany(mappedBy = "residence", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Contract> contracts = new ArrayList<>();

    @OneToOne(mappedBy = "residence", fetch = FetchType.LAZY)
    private ResidenceManager manager;

    @Column(columnDefinition = "TEXT")
    private String contactInformation;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private ResidenceStatus status;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}