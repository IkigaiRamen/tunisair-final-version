package com.tunisair.meetingmanagement.service.impl;

import com.tunisair.meetingmanagement.model.Role;
import com.tunisair.meetingmanagement.model.User;
import com.tunisair.meetingmanagement.repository.UserRepository;
import com.tunisair.meetingmanagement.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    @Transactional
    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        user.setFullName(userDetails.getFullName());
        user.setEmail(userDetails.getEmail());

        // Only update password if a new one is provided and it's different from the
        // current one
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            // Don't encode if the password is already encoded (contains $2a$)
            if (!userDetails.getPassword().startsWith("$2a$")) {
                user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
            }
        }

        // Preserve the existing roles and enabled status
        user.setEnabled(user.isEnabled()); // Keep the current enabled status

        return userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        userRepository.delete(user);
    }

    @Override
    public Set<User> getUsersByRole(Role.RoleName roleName) {
        return userRepository.findByRoles_Name(roleName);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    @Transactional
    public User updateProfilePicture(Long id, String profilePicture) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setProfilePicture(profilePicture);
        return userRepository.save(user);
    }
}