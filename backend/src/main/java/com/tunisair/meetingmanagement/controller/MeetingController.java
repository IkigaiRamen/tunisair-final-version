package com.tunisair.meetingmanagement.controller;

import com.tunisair.meetingmanagement.model.Meeting;
import com.tunisair.meetingmanagement.model.User;
import com.tunisair.meetingmanagement.service.AuthService;
import com.tunisair.meetingmanagement.service.MeetingService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/meetings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Meeting Management", description = "Meeting management APIs")
public class MeetingController {

    private final MeetingService meetingService;
    private final AuthService authService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Meeting>> getAllMeetings() {
        return ResponseEntity.ok(meetingService.getAllMeetings());
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Meeting> getMeetingById(@PathVariable Long id) {
        return ResponseEntity.ok(meetingService.getMeetingById(id).orElseThrow());
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Meeting> createMeeting(@Valid @RequestBody Meeting meeting) {
        User currentUser = authService.getCurrentUser();
        meeting.setCreatedBy(currentUser);
        return ResponseEntity.ok(meetingService.createMeeting(meeting));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY') or @meetingService.getMeetingById(#id).get().createdBy.id == authentication.principal.id")
    public ResponseEntity<Meeting> updateMeeting(@PathVariable Long id, @Valid @RequestBody Meeting meetingDetails) {
        return ResponseEntity.ok(meetingService.updateMeeting(id, meetingDetails));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY') or @meetingService.getMeetingById(#id).get().createdBy.id == authentication.principal.id")
    public ResponseEntity<Void> deleteMeeting(@PathVariable Long id) {
        meetingService.deleteMeeting(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my-meetings")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Meeting>> getMyMeetings() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(meetingService.getMeetingsByCreator(currentUser));
    }

    @GetMapping("/participating")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Meeting>> getParticipatingMeetings() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(meetingService.getMeetingsByParticipant(currentUser));
    }

    @GetMapping("/date-range")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Meeting>> getMeetingsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(meetingService.getMeetingsByDateRange(start, end));
    }

    @GetMapping("/past")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Meeting>> getPastMeetings(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start) {
        return ResponseEntity.ok(meetingService.getPastMeetings(start));
    }

    @GetMapping("/upcoming")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Meeting>> getUpcomingMeetings(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start) {
        return ResponseEntity.ok(meetingService.getUpcomingMeetings(start));
    }

    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Meeting>> searchMeetingsByTitle(@RequestParam String title) {
        return ResponseEntity.ok(meetingService.searchMeetingsByTitle(title));
    }

    @PostMapping("/{meetingId}/participants/{userId}")
    @PreAuthorize("isAuthenticated() and @meetingService.getMeetingById(#meetingId).get().creator.id == authentication.principal.id")
    public ResponseEntity<Meeting> addParticipant(@PathVariable Long meetingId, @PathVariable Long userId) {
        return ResponseEntity.ok(meetingService.addParticipant(meetingId, userId));
    }

    @DeleteMapping("/{meetingId}/participants/{userId}")
    @PreAuthorize("isAuthenticated() and @meetingService.getMeetingById(#meetingId).get().creator.id == authentication.principal.id")
    public ResponseEntity<Meeting> removeParticipant(@PathVariable Long meetingId, @PathVariable Long userId) {
        return ResponseEntity.ok(meetingService.removeParticipant(meetingId, userId));
    }
}