package com.neovesta.backend.exceptions;

public class UserException extends RuntimeException {
    public UserException(String message) {
        super(message);
    }
}