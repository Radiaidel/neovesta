package com.neovesta.backend.controllers;

import com.neovesta.backend.dtos.request.CreateUserRequest;
import com.neovesta.backend.dtos.request.UpdatePasswordRequest;
import com.neovesta.backend.dtos.request.UpdateUserRequest;
import com.neovesta.backend.dtos.request.UserSearchRequest;
import com.neovesta.backend.dtos.response.UserResponse;
import com.neovesta.backend.models.enums.Role;
import com.neovesta.backend.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "Endpoints for managing users")
public class UserController {
    private final UserService userService;

    @PostMapping
    @Operation(summary = "Create a new user (Register)")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        return ResponseEntity.ok(userService.createUser(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/search")
    @Operation(summary = "Search users with pagination")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'RESIDENCE_MANAGER', 'SUB_RESIDENCE_MANAGER') or (hasRole('RESIDENT') and #request.role == null)")
    public ResponseEntity<Page<UserResponse>> searchUsers(@Valid UserSearchRequest request) {
        log.info("Searching" + request);
        return ResponseEntity.ok(userService.searchUsers(request));
    }

    @GetMapping("/role/{role}")
    @Operation(summary = "Get users by role")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'RESIDENCE_MANAGER', 'SUB_RESIDENCE_MANAGER')")
    public ResponseEntity<Page<UserResponse>> getUsersByRole(
            @PathVariable Role role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(userService.getUsersByRole(role, page, size));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update user information (except role and status)")
    @PreAuthorize("@userSecurity.isCurrentUser(#id)")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @PutMapping("/{id}/password")
    @Operation(summary = "Update user password")
    @PreAuthorize("@userSecurity.isCurrentUser(#id)")
    public ResponseEntity<UserResponse> updatePassword(
            @PathVariable UUID id,
            @Valid @RequestBody UpdatePasswordRequest request) {
        return ResponseEntity.ok(userService.updatePassword(id, request.getCurrentPassword(), request.getNewPassword()));
    }

    @PutMapping("/{id}/toggle-status")
    @Operation(summary = "Toggle user status (block/unblock)")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Void> toggleUserStatus(@PathVariable UUID id) {
        userService.toggleUserStatus(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/email/{email}")
    @Operation(summary = "Get user by email")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'RESIDENCE_MANAGER', 'SUB_RESIDENCE_MANAGER')")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    @GetMapping("/all")
    @Operation(summary = "Get all users with pagination")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(userService.getAllUsers(page, size));
    }


}