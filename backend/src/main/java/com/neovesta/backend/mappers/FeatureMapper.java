package com.neovesta.backend.mappers;

import com.neovesta.backend.dtos.request.FeatureRequest;
import com.neovesta.backend.dtos.response.FeatureResponse;
import com.neovesta.backend.models.Feature;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface FeatureMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "residence", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "imageUrl", ignore = true) 
    Feature toEntity(FeatureRequest request);
    
    @Mapping(source = "residence.id", target = "residenceId")
    @Mapping(source = "residence.name", target = "residenceName")
    @Mapping(source = "imageUrl", target = "imageUrl")
    FeatureResponse toResponse(Feature feature);
    
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "residence", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "imageUrl", ignore = true) 
    void updateEntity(FeatureRequest request, @MappingTarget Feature feature);
}