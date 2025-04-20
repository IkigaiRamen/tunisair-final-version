package com.tunisair.meeting.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    @Enumerated(EnumType.STRING)
    private RoleName name;

    @Column
    private String description;

    public enum RoleName {
        ROLE_ADMIN,
        ROLE_MANAGER,
        ROLE_USER
    }
} 