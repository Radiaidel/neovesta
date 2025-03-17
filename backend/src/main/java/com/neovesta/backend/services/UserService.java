package com.neovesta.backend.services;

import com.neovesta.backend.dtos.request.CreateUserRequest;
import com.neovesta.backend.dtos.request.UpdateUserRequest;
import com.neovesta.backend.dtos.request.UserSearchRequest;
import com.neovesta.backend.dtos.response.UserResponse;
import com.neovesta.backend.models.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

public interface UserService {
    UserResponse createUser(CreateUserRequest request  );
    
    UserResponse updateUser(UUID id, UpdateUserRequest request);
    
    UserResponse updatePassword(UUID id, String currentPassword, String newPassword);
    
    void toggleUserStatus(UUID id);
    
    void deleteUser(UUID id);

    UserResponse getUserById(UUID id);

    Page<UserResponse> searchUsers(UserSearchRequest request);

    Page<UserResponse> getUsersByRole(Role role, int page, int size);
    
    UserResponse getUserByEmail(String email);

    Page<UserResponse> getAllUsers(int page, int size);
    String uploadProfileImage(UUID id, MultipartFile profileImage) throws IOException;

    Page<UserResponse> searchUsers(String searchTerm, Role role, int page, int size);
}