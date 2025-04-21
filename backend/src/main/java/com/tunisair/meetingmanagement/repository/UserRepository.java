package com.tunisair.meetingmanagement.repository;

import com.tunisair.meetingmanagement.model.Role;
import com.tunisair.meetingmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    Set<User> findByRoles_Name(Role.RoleName roleName);
} 