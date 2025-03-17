package com.neovesta.backend.services.impl;

import com.neovesta.backend.dtos.request.*;
import com.neovesta.backend.dtos.response.AuthResponse;
import com.neovesta.backend.exceptions.InvalidTokenException;
import com.neovesta.backend.exceptions.UserNotFoundException;
import com.neovesta.backend.mappers.UserMapper;
import com.neovesta.backend.models.*;
import com.neovesta.backend.models.enums.Role;
import com.neovesta.backend.repositories.UserRepository;
import com.neovesta.backend.security.JwtService;
import com.neovesta.backend.security.UserDetailsImpl;
import com.neovesta.backend.services.AuthService;
import com.neovesta.backend.services.EmailService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final UserMapper userMapper;

    public AuthServiceImpl(AuthenticationManager authenticationManager, JwtService jwtService, UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService, UserMapper userMapper) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.userMapper = userMapper;

    }


    @Override
    public AuthResponse login(@Valid LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            
            String token = jwtService.generateToken(userDetails);
            String refreshToken = jwtService.generateRefreshToken(userDetails);

            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new UserNotFoundException("User not found"));

            log.info("User successfully logged in: {}", user.getEmail());

            return AuthResponse.builder()
                    .token(token)
                    .refreshToken(refreshToken)
                    .user(userMapper.toResponse(user))
                    .build();
        } catch (AuthenticationException e) {
            log.error("Login failed for user {}: {}", request.getEmail(), e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Login failed for user {}: {}", request.getEmail(), e.getMessage());
            throw new RuntimeException("Login failed: " + e.getMessage());
        }
    }

    @Override
    public void forgotPassword(@Valid ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + request.getEmail()));

        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiryDate(LocalDateTime.now().plusMinutes(30));
        userRepository.save(user);

        try {
            emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
            log.info("Password reset token sent to user: {}", request.getEmail());
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}: {}", request.getEmail(), e.getMessage());
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    @Override
    @Transactional
    public void resetPassword(@Valid ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new InvalidTokenException("Invalid or expired reset token"));

        if (user.getResetTokenExpiryDate().isBefore(LocalDateTime.now())) {
            throw new InvalidTokenException("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiryDate(null);
        userRepository.save(user);
        log.info("Password reset successful for user: {}", user.getEmail());
    }

    @Override
    @Transactional
    public void registerUser(@Valid RegisterUserRequest request) {
        try {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Email already exists");
            }

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                throw new IllegalStateException("No authenticated user found");
            }

            UserDetailsImpl currentUser = (UserDetailsImpl) authentication.getPrincipal();
            validateRoleCreation(currentUser.getUser().getRole(), request.getRole());

            User user = createUserByRole(request);
            String password = request.getPassword();
            user.setPassword(passwordEncoder.encode(password));
            
            User savedUser = userRepository.save(user);
            log.info("Created new user with role {} and email {}", request.getRole(), request.getEmail());
            
            emailService.sendWelcomeEmail(savedUser.getEmail(), password);
        } catch (Exception e) {
            log.error("Failed to register user {}: {}", request.getEmail(), e.getMessage());
            throw e;
        }
    }

    private void validateRoleCreation(Role currentUserRole, Role targetRole) {
        boolean isAllowed = switch (currentUserRole) {
            case SUPER_ADMIN -> targetRole == Role.ADMIN || targetRole == Role.RESIDENCE_MANAGER;
            case ADMIN -> targetRole == Role.RESIDENCE_MANAGER;
            case RESIDENCE_MANAGER -> targetRole == Role.SUB_RESIDENCE_MANAGER || targetRole == Role.RESIDENT;
            case SUB_RESIDENCE_MANAGER -> targetRole == Role.RESIDENT;
            default -> false;
        };

        if (!isAllowed) {
            String message = String.format("User with role %s is not authorized to create users with role %s", 
                currentUserRole, targetRole);
            log.warn(message);
            throw new IllegalArgumentException(message);
        }
    }

    private User createUserByRole(RegisterUserRequest request) {
        return switch (request.getRole()) {
            case ADMIN -> Admin.builder()
                    .email(request.getEmail())
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .phoneNumber(request.getPhoneNumber())
                    .role(Role.ADMIN)
                    .build();
            case RESIDENCE_MANAGER -> {
                // TODO: Implement residence association when residence CRUD is ready
                yield ResidenceManager.builder()
                        .email(request.getEmail())
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .phoneNumber(request.getPhoneNumber())
                        .role(Role.RESIDENCE_MANAGER)
                        .build();
            }
            case SUB_RESIDENCE_MANAGER -> {
                // TODO: Implement manager association when residence CRUD is ready
                yield SubResidenceManager.builder()
                        .email(request.getEmail())
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .phoneNumber(request.getPhoneNumber())
                        .role(Role.SUB_RESIDENCE_MANAGER)
                        .build();
            }
            case RESIDENT -> Resident.builder()
                    .email(request.getEmail())
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .phoneNumber(request.getPhoneNumber())
                    .role(Role.RESIDENT)
                    .build();
            default -> throw new IllegalArgumentException("Invalid role for registration: " + request.getRole());
        };
    }



    @Override
    public AuthResponse loginWithRememberMe(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            
            String token = jwtService.generateToken(userDetails, true);
            String refreshToken = jwtService.generateRefreshToken(userDetails);
            String rememberMeToken = jwtService.generateRememberMeToken(userDetails);

            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new UserNotFoundException("User not found"));

            log.info("User successfully logged in with remember-me: {}", user.getEmail());

            return AuthResponse.builder()
                    .token(token)
                    .refreshToken(refreshToken)
                    .rememberMeToken(rememberMeToken)
                    .user(userMapper.toResponse(user))
                    .build();
        } catch (AuthenticationException e) {
            log.error("Login with remember-me failed for user {}: {}", request.getEmail(), e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Login with remember-me failed for user {}: {}", request.getEmail(), e.getMessage());
            throw new RuntimeException("Login with remember-me failed: " + e.getMessage());
        }
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        try {
            String userEmail = jwtService.extractUsername(refreshToken);
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new UserNotFoundException("User not found"));

            if (jwtService.isTokenValid(refreshToken, new UserDetailsImpl(user))) {
                String token = jwtService.generateToken(new UserDetailsImpl(user));
                String newRefreshToken = jwtService.generateRefreshToken(new UserDetailsImpl(user));

                return AuthResponse.builder()
                        .token(token)
                        .refreshToken(newRefreshToken)
                        .user(userMapper.toResponse(user))
                        .build();
            }
            throw new InvalidTokenException("Invalid refresh token");
        } catch (Exception e) {
            log.error("Token refresh failed: {}", e.getMessage());
            throw e;
        }
    }

    @Override
    public void updatePassword(UUID userId, @Valid UpdatePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new InvalidTokenException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}