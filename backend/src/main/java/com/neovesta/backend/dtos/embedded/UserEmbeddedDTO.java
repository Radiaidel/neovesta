package com.neovesta.backend.dtos.embedded;

import com.neovesta.backend.models.enums.Role;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class UserEmbeddedDTO {
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String profilePictureUrl;
    private Role role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean status;
}
