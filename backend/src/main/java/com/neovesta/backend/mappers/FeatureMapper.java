package com.neovesta.backend.mappers;

import com.neovesta.backend.dtos.embedded.ResidenceEmbeddedDTO;
import com.neovesta.backend.dtos.request.FeatureRequest;
import com.neovesta.backend.dtos.response.FeatureResponse;
import com.neovesta.backend.dtos.response.ResidenceResponse;
import com.neovesta.backend.models.Feature;
import com.neovesta.backend.models.Residence;
import org.mapstruct.*;


@Mapper(componentModel = "spring", uses = {ResidenceMapper.class})
public interface FeatureMapper {

    //TODO: residence  ne s'affiche pas dans response
    @Mapping(target = "residence.id", source = "residenceId")
    @Mapping(target = "id", ignore = true)
    Feature toEntity(FeatureRequest featureRequest);

    @Mapping(target = "residence", source = "residence")
    FeatureResponse toResponse(Feature feature);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "residence", ignore = true)
    void updateEntity(FeatureRequest featureRequest, @MappingTarget Feature feature);
}