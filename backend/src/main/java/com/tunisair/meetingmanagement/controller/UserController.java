package com.tunisair.meetingmanagement.controller;

import com.tunisair.meetingmanagement.model.Role;
import com.tunisair.meetingmanagement.model.User;
import com.tunisair.meetingmanagement.service.UserService;
import com.tunisair.meetingmanagement.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import jakarta.validation.Valid;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;
    private final FileStorageService fileStorageService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasRole('ADMIN') or #email == authentication.principal.email")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userService.getUserByEmail(email);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @Valid @RequestBody User userDetails) {
        // Get the current user's email from the authentication context
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        // Get the user being updated
        User userToUpdate = userService.getUserById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Check if the current user is trying to update their own profile
        if (!userToUpdate.getEmail().equals(currentUserEmail)) {
            throw new RuntimeException("You can only update your own profile");
        }

        return ResponseEntity.ok(userService.updateUser(id, userDetails));
    }

    @PutMapping(value = "/{id}/profile-picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> updateProfilePicture(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        try {
            // Get the current user's email from the authentication context
            String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();

            // Get the user being updated
            User userToUpdate = userService.getUserById(id)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

            // Check if the current user is trying to update their own profile
            if (!userToUpdate.getEmail().equals(currentUserEmail)) {
                throw new RuntimeException("You can only update your own profile picture");
            }

            // Save the file and get the URL
            String profilePictureUrl = fileStorageService.saveProfilePicture(file, id);

            // Update the user with the new profile picture URL
            return ResponseEntity.ok(userService.updateProfilePicture(id, profilePictureUrl));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/role/{roleName}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Set<User>> getUsersByRole(@PathVariable Role.RoleName roleName) {
        return ResponseEntity.ok(userService.getUsersByRole(roleName));
    }

    @GetMapping("/test-static")
    public ResponseEntity<String> testStaticResources() {
        return ResponseEntity.ok("Static resources should be accessible at /profile-pictures/");
    }
}