package com.flightmanagement.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "com.flightmanagement.repository")
public class DatabaseConfig {
    // JPA Repository configuration
}
