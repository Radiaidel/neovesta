package com.neovesta.backend.services;

public interface EmailService {
    void sendWelcomeEmail(String to, String password);
    void sendPasswordResetEmail(String to, String resetToken);
}