package com.neovesta.backend.config;

import com.neovesta.backend.models.User;
import com.neovesta.backend.models.enums.Role;
import com.neovesta.backend.repositories.UserRepository;

import lombok.extern.slf4j.Slf4j;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;

@Configuration
@Slf4j
public class DefaultAdminConfig {

    @Bean
    public CommandLineRunner createDefaultAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByEmail("admin@neovesta.com").isEmpty()) {
                User admin = new User();
                admin.setId(UUID.randomUUID());
                admin.setEmail("admin@neovesta.com");
                admin.setPassword(passwordEncoder.encode("password123"));
                admin.setFirstName("Default");
                admin.setLastName("Admin");
                admin.setRole(Role.SUPER_ADMIN);
                
                userRepository.save(admin);
                log.info("Default admin created: admin@neovesta.com / password123");
            } else {
                log.error("Admin already exists. Skipping default admin creation.");
            }
        };
    }
}
