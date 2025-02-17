package com.neovesta.backend.exceptions;

public class ResidenceNotFoundException extends RuntimeException {
    public ResidenceNotFoundException(String message) {
        super(message);
    }
}