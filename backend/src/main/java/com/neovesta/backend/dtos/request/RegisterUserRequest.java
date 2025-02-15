package com.neovesta.backend.dtos.request;

import com.neovesta.backend.models.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class RegisterUserRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @NotNull(message = "Role is required")
    private Role role;

    private String password; 

    private UUID residenceId;

    private UUID managerId;
}
