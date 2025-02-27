package com.neovesta.backend.exceptions;

public class TokenException extends RuntimeException {
    public TokenException(String message) {
        super(message);
    }
}