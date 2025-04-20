package com.tunisair.meeting.controller;

import com.tunisair.meeting.models.Meeting;
import com.tunisair.meeting.models.User;
import com.tunisair.meeting.service.MeetingService;
import com.tunisair.meeting.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/meetings")
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Meetings", description = "Meeting management APIs")
@SecurityRequirement(name = "bearerAuth")
public class MeetingController {

    private final MeetingService meetingService;
    private final UserService userService;

    @Autowired
    public MeetingController(MeetingService meetingService, UserService userService) {
        this.meetingService = meetingService;
        this.userService = userService;
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Create a new meeting", description = "Creates a new meeting with the current user as the organizer")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Meeting created successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<Meeting> createMeeting(@RequestBody Meeting meeting, Authentication authentication) {
        User currentUser = userService.getUserByUsername(authentication.getName());
        meeting.setOrganizer(currentUser);
        return ResponseEntity.ok(meetingService.createMeeting(meeting));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Update a meeting", description = "Updates an existing meeting by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Meeting updated successfully"),
        @ApiResponse(responseCode = "404", description = "Meeting not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<Meeting> updateMeeting(
            @Parameter(description = "Meeting ID", required = true) @PathVariable Long id,
            @RequestBody Meeting meeting) {
        return ResponseEntity.ok(meetingService.updateMeeting(id, meeting));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a meeting", description = "Deletes a meeting by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Meeting deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Meeting not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<Void> deleteMeeting(
            @Parameter(description = "Meeting ID", required = true) @PathVariable Long id) {
        meetingService.deleteMeeting(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Get meeting by ID", description = "Retrieves a meeting by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Meeting retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Meeting not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<Meeting> getMeetingById(
            @Parameter(description = "Meeting ID", required = true) @PathVariable Long id) {
        return ResponseEntity.ok(meetingService.getMeetingById(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Get all meetings", description = "Retrieves all meetings")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Meetings retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<List<Meeting>> getAllMeetings() {
        return ResponseEntity.ok(meetingService.getAllMeetings());
    }

    @GetMapping("/organizer")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Get meetings by organizer", description = "Retrieves all meetings organized by the current user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Meetings retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<List<Meeting>> getMeetingsByOrganizer(Authentication authentication) {
        User currentUser = userService.getUserByUsername(authentication.getName());
        return ResponseEntity.ok(meetingService.getMeetingsByOrganizer(currentUser));
    }

    @GetMapping("/participant")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Get meetings by participant", description = "Retrieves all meetings where the current user is a participant")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Meetings retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<List<Meeting>> getMeetingsByParticipant(Authentication authentication) {
        User currentUser = userService.getUserByUsername(authentication.getName());
        return ResponseEntity.ok(meetingService.getMeetingsByParticipant(currentUser));
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Get meetings by date range", description = "Retrieves all meetings within a specified date range")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Meetings retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<List<Meeting>> getMeetingsByDateRange(
            @Parameter(description = "Start date and time", required = true) 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @Parameter(description = "End date and time", required = true) 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(meetingService.getMeetingsByDateRange(start, end));
    }

    @GetMapping("/upcoming")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Get upcoming meetings", description = "Retrieves all upcoming meetings")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Meetings retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<List<Meeting>> getUpcomingMeetings() {
        return ResponseEntity.ok(meetingService.getUpcomingMeetings());
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Get overdue meetings", description = "Retrieves all overdue meetings")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Meetings retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<List<Meeting>> getOverdueMeetings() {
        return ResponseEntity.ok(meetingService.getOverdueMeetings());
    }

    @PostMapping("/{meetingId}/participants/{userId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Add participant to meeting", description = "Adds a participant to a meeting")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Participant added successfully"),
        @ApiResponse(responseCode = "404", description = "Meeting or user not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<Meeting> addParticipant(
            @Parameter(description = "Meeting ID", required = true) @PathVariable Long meetingId,
            @Parameter(description = "User ID", required = true) @PathVariable Long userId) {
        User participant = userService.getUserById(userId);
        return ResponseEntity.ok(meetingService.addParticipant(meetingId, participant));
    }

    @DeleteMapping("/{meetingId}/participants/{userId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Remove participant from meeting", description = "Removes a participant from a meeting")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Participant removed successfully"),
        @ApiResponse(responseCode = "404", description = "Meeting or user not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<Meeting> removeParticipant(
            @Parameter(description = "Meeting ID", required = true) @PathVariable Long meetingId,
            @Parameter(description = "User ID", required = true) @PathVariable Long userId) {
        User participant = userService.getUserById(userId);
        return ResponseEntity.ok(meetingService.removeParticipant(meetingId, participant));
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Mark meeting as completed", description = "Marks a meeting as completed")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Meeting marked as completed"),
        @ApiResponse(responseCode = "404", description = "Meeting not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<Meeting> markAsCompleted(
            @Parameter(description = "Meeting ID", required = true) @PathVariable Long id) {
        return ResponseEntity.ok(meetingService.markAsCompleted(id));
    }
} 