package com.neovesta.backend.services.impl;

import com.neovesta.backend.dtos.request.CreateUserRequest;
import com.neovesta.backend.dtos.request.UpdateUserRequest;
import com.neovesta.backend.dtos.response.UserResponse;
import com.neovesta.backend.exceptions.ResourceNotFoundException;
import com.neovesta.backend.exceptions.UnauthorizedException;
import com.neovesta.backend.mappers.UserMapper;
import com.neovesta.backend.models.*;
import com.neovesta.backend.models.enums.Role;
import com.neovesta.backend.repositories.UserRepository;
import com.neovesta.backend.security.UserDetailsImpl;
import com.neovesta.backend.services.CloudinaryService;
import com.neovesta.backend.utils.AuthenticationFacade;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private CloudinaryService cloudinaryService;

    @Mock
    private AuthenticationFacade authenticationFacade;

    @InjectMocks
    private UserServiceImpl userService;

    private UUID userId;
    private User user;
    private UserResponse userResponse;
    private CreateUserRequest createUserRequest;
    private UpdateUserRequest updateUserRequest;
    private Authentication authentication;
    private UserDetailsImpl userDetails;
    private ResidenceManager residenceManager;
    private Residence residence;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();

        user = new Admin();
        user.setId(userId);
        user.setEmail("test@example.com");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setPhoneNumber("1234567890");
        user.setPassword("encodedPassword");
        user.setRole(Role.ADMIN);
        user.setStatus(true);

        userResponse = new UserResponse();
        userResponse.setId(userId);
        userResponse.setEmail("test@example.com");
        userResponse.setFirstName("John");
        userResponse.setLastName("Doe");
        userResponse.setRole(Role.ADMIN);

        createUserRequest = new CreateUserRequest();
        createUserRequest.setEmail("new@example.com");
        createUserRequest.setPassword("password");
        createUserRequest.setFirstName("Jane");
        createUserRequest.setLastName("Smith");
        createUserRequest.setPhoneNumber("0987654321");
        createUserRequest.setRole(Role.ADMIN);

        updateUserRequest = new UpdateUserRequest();
        updateUserRequest.setEmail("updated@example.com");
        updateUserRequest.setFirstName("Updated");
        updateUserRequest.setLastName("User");
        updateUserRequest.setPhoneNumber("5555555555");

        authentication = mock(Authentication.class);
        userDetails = mock(UserDetailsImpl.class);

        residenceManager = new ResidenceManager();
        residenceManager.setId(UUID.randomUUID());
        residenceManager.setRole(Role.RESIDENCE_MANAGER);

        residence = new Residence();
        residence.setId(UUID.randomUUID());
        residenceManager.setResidence(residence);
    }

    @Test
    void createUser_Admin_Success() {
        createUserRequest.setRole(Role.ADMIN);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(Admin.class))).thenAnswer(invocation -> {
            Admin savedUser = invocation.getArgument(0);
            savedUser.setId(userId);
            return savedUser;
        });
        when(userMapper.toResponse(any(User.class))).thenReturn(userResponse);

        UserResponse result = userService.createUser(createUserRequest);

        assertNotNull(result);
        assertEquals(userResponse, result);
        verify(userRepository).save(any(Admin.class));
        verify(userMapper).toResponse(any(User.class));
        verify(passwordEncoder).encode(createUserRequest.getPassword());
    }

    @Test
    void createUser_SubResidenceManager_Success() {
        createUserRequest.setRole(Role.SUB_RESIDENCE_MANAGER);
        UUID managerId = UUID.randomUUID();
        createUserRequest.setManagerId(managerId);

        ResidenceManager manager = new ResidenceManager();
        manager.setId(managerId);
        manager.setRole(Role.RESIDENCE_MANAGER);

        when(userRepository.findById(managerId)).thenReturn(Optional.of(manager));
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(SubResidenceManager.class))).thenAnswer(invocation -> {
            SubResidenceManager savedUser = invocation.getArgument(0);
            savedUser.setId(userId);
            return savedUser;
        });
        when(userMapper.toResponse(any(User.class))).thenReturn(userResponse);

        UserResponse result = userService.createUser(createUserRequest);

        assertNotNull(result);
        assertEquals(userResponse, result);
        verify(userRepository).findById(managerId);
        verify(userRepository).save(any(SubResidenceManager.class));
        verify(userMapper).toResponse(any(User.class));
        verify(passwordEncoder).encode(createUserRequest.getPassword());
    }

    @Test
    void createUser_InvalidManagerId_ThrowsException() {
        createUserRequest.setRole(Role.SUB_RESIDENCE_MANAGER);
        UUID managerId = UUID.randomUUID();
        createUserRequest.setManagerId(managerId);

        when(userRepository.findById(managerId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> userService.createUser(createUserRequest));
        verify(userRepository).findById(managerId);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void getUserById_ExistingUser_ReturnsUser() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userMapper.toResponse(user)).thenReturn(userResponse);

        UserResponse result = userService.getUserById(userId);

        assertNotNull(result);
        assertEquals(userResponse, result);
        verify(userRepository).findById(userId);
        verify(userMapper).toResponse(user);
    }

    @Test
    void getUserById_NonExistingUser_ThrowsException() {
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.getUserById(userId));
        verify(userRepository).findById(userId);
        verify(userMapper, never()).toResponse(any(User.class));
    }

    @Test
    void getUsersByRole_ExistingUsers_ReturnsUserPage() {
        int page = 0;
        int size = 10;
        PageRequest pageRequest = PageRequest.of(page, size);
        List<User> users = List.of(user);
        Page<User> userPage = new PageImpl<>(users, pageRequest, users.size());

        when(userRepository.findByRole(Role.ADMIN, pageRequest)).thenReturn(userPage);
        when(userMapper.toResponse(user)).thenReturn(userResponse);

        Page<UserResponse> result = userService.getUsersByRole(Role.ADMIN, page, size);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(userResponse, result.getContent().get(0));
        verify(userRepository).findByRole(Role.ADMIN, pageRequest);
        verify(userMapper).toResponse(user);
    }

    @Test
    void getUsersByRole_NoUsers_ReturnsEmptyPage() {
        int page = 0;
        int size = 10;
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<User> emptyPage = new PageImpl<>(List.of(), pageRequest, 0);

        when(userRepository.findByRole(Role.ADMIN, pageRequest)).thenReturn(emptyPage);

        Page<UserResponse> result = userService.getUsersByRole(Role.ADMIN, page, size);

        assertNotNull(result);
        assertEquals(0, result.getTotalElements());
        assertTrue(result.getContent().isEmpty());
        verify(userRepository).findByRole(Role.ADMIN, pageRequest);
        verify(userMapper, never()).toResponse(any(User.class));
    }

    @Test
    void updateUser_ExistingUser_Success() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toResponse(user)).thenReturn(userResponse);

        UserResponse result = userService.updateUser(userId, updateUserRequest);

        assertNotNull(result);
        assertEquals(userResponse, result);
        assertEquals(updateUserRequest.getEmail(), user.getEmail());
        assertEquals(updateUserRequest.getFirstName(), user.getFirstName());
        assertEquals(updateUserRequest.getLastName(), user.getLastName());
        assertEquals(updateUserRequest.getPhoneNumber(), user.getPhoneNumber());
        verify(userRepository).findById(userId);
        verify(userRepository).save(user);
        verify(userMapper).toResponse(user);
    }

    @Test
    void updateUser_WithProfilePicture_Success() throws IOException {
        MockMultipartFile profilePicture = new MockMultipartFile(
                "profilePicture", "test.jpg", "image/jpeg", "test image content".getBytes());
        updateUserRequest.setProfilePicture(profilePicture);
        user.setProfilePictureUrl("old-image-url");

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(cloudinaryService.uploadImage(profilePicture)).thenReturn("new-image-url");
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toResponse(user)).thenReturn(userResponse);

        UserResponse result = userService.updateUser(userId, updateUserRequest);

        assertNotNull(result);
        assertEquals(userResponse, result);
        assertEquals("new-image-url", user.getProfilePictureUrl());
        verify(userRepository).findById(userId);
        verify(cloudinaryService).deleteImage("old-image-url");
        verify(cloudinaryService).uploadImage(profilePicture);
        verify(userRepository).save(user);
        verify(userMapper).toResponse(user);
    }

    @Test
    void updateUser_NonExistingUser_ThrowsException() {
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.updateUser(userId, updateUserRequest));
        verify(userRepository).findById(userId);
        verify(userRepository, never()).save(any(User.class));
        verify(userMapper, never()).toResponse(any(User.class));
    }

    @Test
    void updatePassword_IncorrectCurrentPassword_ThrowsException() {
        String currentPassword = "wrongPassword";
        String newPassword = "newPassword";

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(currentPassword, user.getPassword())).thenReturn(false);

        assertThrows(UnauthorizedException.class,
                () -> userService.updatePassword(userId, currentPassword, newPassword));
        verify(userRepository).findById(userId);
        verify(passwordEncoder).matches(currentPassword, user.getPassword());
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void toggleUserStatus_ActiveUser_TogglesStatusToInactive() {
        user.setStatus(true);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        userService.toggleUserStatus(userId);

        assertFalse(user.isStatus());
        verify(userRepository).findById(userId);
        verify(userRepository).save(user);
    }

    @Test
    void toggleUserStatus_InactiveUser_TogglesStatusToActive() {
        user.setStatus(false);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        userService.toggleUserStatus(userId);

        assertTrue(user.isStatus());
        verify(userRepository).findById(userId);
        verify(userRepository).save(user);
    }

    @Test
    void toggleUserStatus_NonExistingUser_ThrowsException() {
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.toggleUserStatus(userId));
        verify(userRepository).findById(userId);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void deleteUser_ExistingUser_Success() {
        when(userRepository.existsById(userId)).thenReturn(true);

        userService.deleteUser(userId);

        verify(userRepository).existsById(userId);
        verify(userRepository).deleteUserWithCascade(userId);
    }

    @Test
    void deleteUser_NonExistingUser_ThrowsException() {
        when(userRepository.existsById(userId)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> userService.deleteUser(userId));
        verify(userRepository).existsById(userId);
        verify(userRepository, never()).deleteUserWithCascade(any(UUID.class));
    }

    @Test
    void getUserByEmail_ExistingUser_ReturnsUser() {
        String email = "test@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(userMapper.toResponse(user)).thenReturn(userResponse);

        UserResponse result = userService.getUserByEmail(email);

        assertNotNull(result);
        assertEquals(userResponse, result);
        verify(userRepository).findByEmail(email);
        verify(userMapper).toResponse(user);
    }

    @Test
    void getUserByEmail_NonExistingUser_ThrowsException() {
        String email = "nonexistent@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.getUserByEmail(email));
        verify(userRepository).findByEmail(email);
        verify(userMapper, never()).toResponse(any(User.class));
    }

    @Test
    void getAllUsers_ExistingUsers_ReturnsUserPage() {
        int page = 0;
        int size = 10;
        PageRequest pageRequest = PageRequest.of(page, size);
        List<User> users = List.of(user);
        Page<User> userPage = new PageImpl<>(users, pageRequest, users.size());

        when(userRepository.findAll(pageRequest)).thenReturn(userPage);
        when(userMapper.toResponse(user)).thenReturn(userResponse);

        Page<UserResponse> result = userService.getAllUsers(page, size);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(userResponse, result.getContent().get(0));
        verify(userRepository).findAll(pageRequest);
        verify(userMapper).toResponse(user);
    }

    @Test
    void getAllUsers_NoUsers_ReturnsEmptyPage() {
        int page = 0;
        int size = 10;
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<User> emptyPage = new PageImpl<>(List.of(), pageRequest, 0);

        when(userRepository.findAll(pageRequest)).thenReturn(emptyPage);

        Page<UserResponse> result = userService.getAllUsers(page, size);

        assertNotNull(result);
        assertEquals(0, result.getTotalElements());
        assertTrue(result.getContent().isEmpty());
        verify(userRepository).findAll(pageRequest);
        verify(userMapper, never()).toResponse(any(User.class));
    }

    @Test
    void uploadProfileImage_NewImage_Success() throws IOException {
        MockMultipartFile profileImage = new MockMultipartFile(
                "profileImage", "test.jpg", "image/jpeg", "test image content".getBytes());

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(cloudinaryService.uploadImage(profileImage)).thenReturn("new-image-url");
        when(userRepository.save(user)).thenReturn(user);

        String result = userService.uploadProfileImage(userId, profileImage);

        assertNotNull(result);
        assertEquals("new-image-url", result);
        assertEquals("new-image-url", user.getProfilePictureUrl());
        verify(userRepository).findById(userId);
        verify(cloudinaryService).uploadImage(profileImage);
        verify(userRepository).save(user);
    }

    @Test
    void uploadProfileImage_ReplaceExistingImage_Success() throws IOException {
        MockMultipartFile profileImage = new MockMultipartFile(
                "profileImage", "test.jpg", "image/jpeg", "test image content".getBytes());
        user.setProfilePictureUrl("old-image-url");

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(cloudinaryService.uploadImage(profileImage)).thenReturn("new-image-url");
        when(userRepository.save(user)).thenReturn(user);

        String result = userService.uploadProfileImage(userId, profileImage);

        assertNotNull(result);
        assertEquals("new-image-url", result);
        assertEquals("new-image-url", user.getProfilePictureUrl());
        verify(userRepository).findById(userId);
        verify(cloudinaryService).deleteImage("old-image-url");
        verify(cloudinaryService).uploadImage(profileImage);
        verify(userRepository).save(user);
    }

    @Test
    void uploadProfileImage_NonExistingUser_ThrowsException() throws IOException {
        MockMultipartFile profileImage = new MockMultipartFile(
                "profileImage", "test.jpg", "image/jpeg", "test image content".getBytes());

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.uploadProfileImage(userId, profileImage));
        verify(userRepository).findById(userId);
        verify(cloudinaryService, never()).uploadImage(any(MultipartFile.class));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void searchUsers_AsSuperAdmin_ReturnsFilteredUsers() {
        String searchTerm = "test";
        Role role = Role.ADMIN;
        int page = 0;
        int size = 10;
        Pageable pageable = PageRequest.of(page, size);

        SuperAdmin superAdmin = new SuperAdmin();
        superAdmin.setId(UUID.randomUUID());
        superAdmin.setRole(Role.SUPER_ADMIN);

        List<User> users = List.of(user);
        Page<User> userPage = new PageImpl<>(users, pageable, users.size());

        when(authenticationFacade.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUser()).thenReturn(superAdmin);
        when(userRepository.findById(superAdmin.getId())).thenReturn(Optional.of(superAdmin));
        when(userRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(userPage);
        when(userMapper.toResponse(user)).thenReturn(userResponse);

        Page<UserResponse> result = userService.searchUsers(searchTerm, role, page, size);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(userResponse, result.getContent().get(0));
        verify(authenticationFacade).getAuthentication();
        verify(userRepository).findById(superAdmin.getId());
        verify(userRepository).findAll(any(Specification.class), eq(pageable));
        verify(userMapper).toResponse(user);
    }

    @Test
    void searchUsers_AsResidenceManager_ReturnsFilteredUsers() {
        String searchTerm = "test";
        Role role = Role.RESIDENT;
        int page = 0;
        int size = 10;
        Pageable pageable = PageRequest.of(page, size);

        List<User> users = List.of(user);
        Page<User> userPage = new PageImpl<>(users, pageable, users.size());

        when(authenticationFacade.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUser()).thenReturn(residenceManager);
        when(userRepository.findById(residenceManager.getId())).thenReturn(Optional.of(residenceManager));
        when(userRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(userPage);
        when(userMapper.toResponse(user)).thenReturn(userResponse);

        Page<UserResponse> result = userService.searchUsers(searchTerm, role, page, size);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(userResponse, result.getContent().get(0));
        verify(authenticationFacade).getAuthentication();
        verify(userRepository).findById(residenceManager.getId());
        verify(userRepository, times(1)).findAll(any(Specification.class), eq(pageable));
        verify(userMapper).toResponse(user);
    }

    @Test
    void searchUsers_UserNotFound_ThrowsException() {
        String searchTerm = "test";
        Role role = Role.ADMIN;
        int page = 0;
        int size = 10;

        when(authenticationFacade.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUser()).thenReturn(user);
        when(userRepository.findById(user.getId())).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> userService.searchUsers(searchTerm, role, page, size));
        verify(authenticationFacade).getAuthentication();
        verify(userRepository).findById(user.getId());
        verify(userRepository, never()).findAll(any(Specification.class), any(Pageable.class));
    }
}