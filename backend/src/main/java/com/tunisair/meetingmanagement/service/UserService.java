package com.tunisair.meetingmanagement.service;

import com.tunisair.meetingmanagement.model.Role;
import com.tunisair.meetingmanagement.model.User;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface UserService {
    List<User> getAllUsers();
    Optional<User> getUserById(Long id);
    Optional<User> getUserByEmail(String email);
    User createUser(User user);
    User updateUser(Long id, User user);
    void deleteUser(Long id);
    Set<User> getUsersByRole(Role.RoleName roleName);
    boolean existsByEmail(String email);
} 