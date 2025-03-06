package com.neovesta.backend.dtos.request;

import lombok.Data;

@Data
public class UserSearchRequest {
    private String searchTerm;
    private int page = 0;
    private int size = 10;
}
