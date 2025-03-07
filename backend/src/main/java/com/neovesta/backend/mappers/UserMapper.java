package com.neovesta.backend.mappers;

import com.neovesta.backend.dtos.request.CreateUserRequest;
import com.neovesta.backend.dtos.response.UserResponse;
import com.neovesta.backend.models.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User toEntity(CreateUserRequest request);

    UserResponse toResponse(User user);
}