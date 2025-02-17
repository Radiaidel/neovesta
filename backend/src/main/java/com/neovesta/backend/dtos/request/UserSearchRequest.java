package com.neovesta.backend.dtos.request;

import com.neovesta.backend.models.enums.Role;
import lombok.Data;

@Data
public class UserSearchRequest {
    private String searchTerm;
    private int page = 0;
    private int size = 10;
}
