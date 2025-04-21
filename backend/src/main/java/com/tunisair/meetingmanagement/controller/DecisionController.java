package com.tunisair.meetingmanagement.controller;

import com.tunisair.meetingmanagement.model.Decision;
import com.tunisair.meetingmanagement.model.Meeting;
import com.tunisair.meetingmanagement.model.User;
import com.tunisair.meetingmanagement.service.DecisionService;
import com.tunisair.meetingmanagement.service.MeetingService;
import com.tunisair.meetingmanagement.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/decisions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Decision Management", description = "Decision management APIs")
public class DecisionController {

    private final DecisionService decisionService;
    private final MeetingService meetingService;
    private final UserService userService;

    @Operation(summary = "Get all decisions")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved all decisions"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY', 'BOARD_MEMBER')")
    public ResponseEntity<List<Decision>> getAllDecisions() {
        return ResponseEntity.ok(decisionService.getAllDecisions());
    }

    @Operation(summary = "Get decision by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved decision"),
        @ApiResponse(responseCode = "404", description = "Decision not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY', 'BOARD_MEMBER')")
    public ResponseEntity<Decision> getDecisionById(@PathVariable Long id) {
        return decisionService.getDecisionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Create new decision")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Decision created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY')")
    public ResponseEntity<Decision> createDecision(@RequestBody Decision decision) {
        return ResponseEntity.ok(decisionService.createDecision(decision));
    }

    @Operation(summary = "Update decision")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Decision updated successfully"),
        @ApiResponse(responseCode = "404", description = "Decision not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY')")
    public ResponseEntity<Decision> updateDecision(
            @PathVariable Long id,
            @RequestBody Decision decisionDetails) {
        return ResponseEntity.ok(decisionService.updateDecision(id, decisionDetails));
    }

    @Operation(summary = "Delete decision")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Decision deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Decision not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDecision(@PathVariable Long id) {
        decisionService.deleteDecision(id);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Get decisions by meeting")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved meeting decisions"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/meeting/{meetingId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY', 'BOARD_MEMBER')")
    public ResponseEntity<List<Decision>> getDecisionsByMeeting(@PathVariable Long meetingId) {
        Meeting meeting = meetingService.getMeetingById(meetingId)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));
        return ResponseEntity.ok(decisionService.getDecisionsByMeeting(meeting));
    }

    @Operation(summary = "Get decisions by responsible user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved user decisions"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY', 'BOARD_MEMBER')")
    public ResponseEntity<List<Decision>> getDecisionsByResponsibleUser(@PathVariable Long userId) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(decisionService.getDecisionsByResponsibleUser(user));
    }

    @Operation(summary = "Get decisions by deadline range")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved decisions in range"),
        @ApiResponse(responseCode = "400", description = "Invalid date range"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/deadline-range")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY', 'BOARD_MEMBER')")
    public ResponseEntity<List<Decision>> getDecisionsByDeadlineRange(
            @Parameter(description = "Start date (yyyy-MM-dd'T'HH:mm:ss)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @Parameter(description = "End date (yyyy-MM-dd'T'HH:mm:ss)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(decisionService.getDecisionsByDeadlineRange(start, end));
    }

    @Operation(summary = "Get pending decisions")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved pending decisions"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY', 'BOARD_MEMBER')")
    public ResponseEntity<List<Decision>> getPendingDecisions() {
        return ResponseEntity.ok(decisionService.getPendingDecisions());
    }

    @Operation(summary = "Assign responsible user to decision")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User assigned successfully"),
        @ApiResponse(responseCode = "404", description = "Decision or user not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PutMapping("/{decisionId}/assign/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY')")
    public ResponseEntity<Decision> assignResponsibleUser(
            @PathVariable Long decisionId,
            @PathVariable Long userId) {
        return ResponseEntity.ok(decisionService.assignResponsibleUser(decisionId, userId));
    }

    @Operation(summary = "Update decision deadline")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Deadline updated successfully"),
        @ApiResponse(responseCode = "404", description = "Decision not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PutMapping("/{decisionId}/deadline")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY')")
    public ResponseEntity<Decision> updateDeadline(
            @PathVariable Long decisionId,
            @Parameter(description = "New deadline (yyyy-MM-dd'T'HH:mm:ss)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime newDeadline) {
        return ResponseEntity.ok(decisionService.updateDeadline(decisionId, newDeadline));
    }
} 