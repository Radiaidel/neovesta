package com.neovesta.backend.mappers;

import com.neovesta.backend.dtos.embedded.ResidenceEmbeddedDTO;
import com.neovesta.backend.dtos.request.CreateResidenceRequest;
import com.neovesta.backend.dtos.request.UpdateResidenceRequest;
import com.neovesta.backend.dtos.response.ResidenceResponse;
import com.neovesta.backend.models.Residence;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface ResidenceMapper {

    ResidenceEmbeddedDTO toEmbeddedDTO(Residence residence);

    @Mapping(target = "imageUrls", ignore = true)
    @Mapping(target = "documents", ignore = true)
    Residence toEntity(CreateResidenceRequest request);

    @Mapping(target = "imageUrls", source = "imageUrls")
    @Mapping(target = "documents", source = "documents")
    ResidenceResponse toResponse(Residence residence);

    @Mapping(target = "documents", ignore = true)
    @Mapping(target = "imageUrls", ignore = true)
    void updateEntityFromRequest(@MappingTarget Residence residence, UpdateResidenceRequest request);

    // @Mapping(target = "id", ignore = true)
    // @Mapping(target = "createdAt", ignore = true)
    // @Mapping(target = "updatedAt", ignore = true)
    // @Mapping(target = "manager", ignore = true)
    // Residence toEntity(CreateResidenceRequest request);

    // @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    // @Mapping(target = "id", ignore = true)
    // @Mapping(target = "createdAt", ignore = true)
    // @Mapping(target = "updatedAt", ignore = true)
    // @Mapping(target = "manager", ignore = true)
    // void updateEntityFromRequest(@MappingTarget Residence residence, UpdateResidenceRequest request);

    // ResidenceResponse toResponse(Residence residence);

    // @AfterMapping
    // default void setDocumentUploadedAt(@MappingTarget Residence residence) {
    //     if (residence.getDocuments() != null) {
    //         residence.getDocuments().forEach(doc -> {
    //             if (doc.getUploadedAt() == null) {
    //                 doc.setUploadedAt(LocalDateTime.now());
    //             }
    //         });
    //     }
    // }
}