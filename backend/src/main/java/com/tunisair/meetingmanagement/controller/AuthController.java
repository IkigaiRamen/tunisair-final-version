package com.tunisair.meetingmanagement.controller;

import com.tunisair.meetingmanagement.model.User;
import com.tunisair.meetingmanagement.payload.request.LoginRequest;
import com.tunisair.meetingmanagement.payload.request.SignupRequest;
import com.tunisair.meetingmanagement.payload.response.JwtResponse;
import com.tunisair.meetingmanagement.payload.response.MessageResponse;
import com.tunisair.meetingmanagement.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Authentication", description = "Authentication management APIs")
public class AuthController {

    private final AuthService authService;
    private final PasswordEncoder passwordEncoder;

    @Operation(summary = "Authenticate user", description = "Authenticates a user and returns a JWT token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully authenticated"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authenticateUser(
            @Parameter(description = "Login credentials", required = true) @Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.authenticateUser(loginRequest));
    }

    @Operation(summary = "Register new user", description = "Registers a new regular user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User registered successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input or email already in use")
    })
    @PostMapping("/signup")
    public ResponseEntity<MessageResponse> registerUser(
            @Parameter(description = "User registration details", required = true) @Valid @RequestBody SignupRequest signupRequest) {
        return ResponseEntity.ok(authService.registerUser(signupRequest));
    }

    @Operation(summary = "Register new admin", description = "Registers a new admin user (requires ADMIN role)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Admin registered successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input or email already in use"),
            @ApiResponse(responseCode = "403", description = "Access denied - requires ADMIN role")
    })
    @PostMapping("/signup/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> registerAdmin(
            @Parameter(description = "Admin registration details", required = true) @Valid @RequestBody SignupRequest signupRequest) {
        return ResponseEntity.ok(authService.registerAdmin(signupRequest));
    }

    @Operation(summary = "Get current user", description = "Returns the current authenticated user's details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved user details"),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> getCurrentUser() {
        return ResponseEntity.ok(authService.getCurrentUser());
    }

    @PostMapping("/verify-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Boolean> verifyPassword(@RequestBody Map<String, String> request) {
        try {
            String password = request.get("password");
            if (password == null || password.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            User currentUser = authService.getCurrentUser();
            if (currentUser == null || currentUser.getPassword() == null) {
                return ResponseEntity.status(500).build();
            }

            // Log the comparison for debugging
            System.out.println("Verifying password for user: " + currentUser.getEmail());
            System.out.println("Provided password: " + password);
            System.out.println("Stored password hash: " + currentUser.getPassword());

            // Encrypt the provided password and compare
            String encryptedPassword = passwordEncoder.encode(password);
            boolean isValid = passwordEncoder.matches(password, currentUser.getPassword());

            System.out.println("Password verification result: " + isValid);
            return ResponseEntity.ok(isValid);
        } catch (Exception e) {
            System.out.println("Error during password verification: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }
}