package com.neovesta.backend.mappers;

import com.neovesta.backend.dtos.request.CreateUserRequest;
import com.neovesta.backend.dtos.response.UserResponse;
import com.neovesta.backend.models.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

//    @Mapping(target = "id", ignore = true)
//    @Mapping(target = "role", ignore = true)
//    @Mapping(target = "createdAt", ignore = true)
//    @Mapping(target = "updatedAt", ignore = true)
//    @Mapping(target = "status", constant = "true")
    User toEntity(CreateUserRequest request);

    UserResponse toResponse(User user);
}