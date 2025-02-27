package com.neovesta.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("file:./backend/.env")
public class EnvConfig {
}
