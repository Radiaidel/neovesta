package com.neovesta.backend.controllers;

import com.neovesta.backend.dtos.request.*;
import com.neovesta.backend.dtos.response.AuthResponse;
import com.neovesta.backend.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(request.isRememberMe() ? 
            authService.loginWithRememberMe(request) : 
            authService.login(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(@RequestParam String refreshToken) {
        return ResponseEntity.ok(authService.refreshToken(refreshToken));
    }

    @PostMapping("/register")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'RESIDENCE_MANAGER' , 'SUB_RESIDENCE_MANAGER')")
    public ResponseEntity<Void> registerUser(@Valid @RequestBody RegisterUserRequest request) {
        authService.registerUser(request);
        return ResponseEntity.ok().build();
    }
}