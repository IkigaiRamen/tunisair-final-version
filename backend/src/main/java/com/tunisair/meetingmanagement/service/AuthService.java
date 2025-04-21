package com.tunisair.meetingmanagement.service;

import com.tunisair.meetingmanagement.model.User;
import com.tunisair.meetingmanagement.payload.request.LoginRequest;
import com.tunisair.meetingmanagement.payload.request.SignupRequest;
import com.tunisair.meetingmanagement.payload.response.JwtResponse;
import com.tunisair.meetingmanagement.payload.response.MessageResponse;

public interface AuthService {
    JwtResponse authenticateUser(LoginRequest loginRequest);
    MessageResponse registerUser(SignupRequest signupRequest);
    MessageResponse registerAdmin(SignupRequest signupRequest);
    User getCurrentUser();
} 