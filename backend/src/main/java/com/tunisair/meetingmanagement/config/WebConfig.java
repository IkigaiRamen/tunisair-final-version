package com.tunisair.meetingmanagement.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String userHome = System.getProperty("user.home");
        String profilePicturesPath = Paths.get(userHome, "tunisair", "profile-pictures").toString();
        
        registry.addResourceHandler("/profile-pictures/**")
                .addResourceLocations("file:" + profilePicturesPath + "/");
    }
} 