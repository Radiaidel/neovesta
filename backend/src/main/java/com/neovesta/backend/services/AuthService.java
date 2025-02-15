package com.neovesta.backend.services;

import com.neovesta.backend.dtos.request.*;
import com.neovesta.backend.dtos.response.AuthResponse;
import jakarta.validation.Valid;

import java.util.UUID;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse loginWithRememberMe(LoginRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
    void updatePassword(UUID userId, @Valid UpdatePasswordRequest request);
    AuthResponse refreshToken(String refreshToken);
    void registerUser(RegisterUserRequest request);
}