package com.tunisair.meeting;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class MeetingManagementApplication {
    public static void main(String[] args) {
        SpringApplication.run(MeetingManagementApplication.class, args);
    }
} 