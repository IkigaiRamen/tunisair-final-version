package com.tunisair.meeting.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .components(new Components()
                        .addSecuritySchemes("bearerAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")))
                .info(new Info()
                        .title("Tunisair Meeting Management API")
                        .description("API documentation for the Tunisair Meeting Management Web Application")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Tunisair Development Team")
                                .email("dev@tunisair.com")
                                .url("https://www.tunisair.com"))
                        .license(new License()
                                .name("Tunisair License")
                                .url("https://www.tunisair.com/license")));
    }
} 