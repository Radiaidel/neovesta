package com.neovesta.backend.mappers;

import com.neovesta.backend.dtos.request.SubscriptionRequestDTO;
import com.neovesta.backend.dtos.response.SubscriptionResponseDTO;
import com.neovesta.backend.models.Subscription;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface SubscriptionMapper {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "feature.id", target = "featureId")
    SubscriptionRequestDTO toRequestDTO(Subscription subscription);

    @Mapping(source = "user", target = "user")
    @Mapping(source = "feature", target = "feature")
    SubscriptionResponseDTO toResponseDTO(Subscription subscription);

    @Mapping(source = "userId", target = "user.id")
    @Mapping(source = "featureId", target = "feature.id")
    Subscription fromRequestDTO(SubscriptionRequestDTO dto);
}

