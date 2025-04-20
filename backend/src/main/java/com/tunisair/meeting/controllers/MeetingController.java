package com.tunisair.meeting.controllers;

import com.tunisair.meeting.models.Meeting;
import com.tunisair.meeting.models.User;
import com.tunisair.meeting.service.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/meetings")
public class MeetingController {
    @Autowired
    private MeetingService meetingService;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Meeting> createMeeting(@Valid @RequestBody Meeting meeting) {
        Meeting createdMeeting = meetingService.createMeeting(meeting);
        return ResponseEntity.ok(createdMeeting);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Meeting> getMeeting(@PathVariable Long id) {
        return meetingService.getMeetingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Meeting>> getAllMeetings() {
        List<Meeting> meetings = meetingService.getAllMeetings();
        return ResponseEntity.ok(meetings);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Meeting> updateMeeting(@PathVariable Long id, @Valid @RequestBody Meeting meeting) {
        meeting.setId(id);
        Meeting updatedMeeting = meetingService.updateMeeting(meeting);
        return ResponseEntity.ok(updatedMeeting);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteMeeting(@PathVariable Long id) {
        meetingService.deleteMeeting(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/organizer/{organizerId}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Meeting>> getMeetingsByOrganizer(@PathVariable User organizer) {
        List<Meeting> meetings = meetingService.getMeetingsByOrganizer(organizer);
        return ResponseEntity.ok(meetings);
    }

    @GetMapping("/participant/{participantId}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Meeting>> getMeetingsByParticipant(@PathVariable User participant) {
        List<Meeting> meetings = meetingService.getMeetingsByParticipant(participant);
        return ResponseEntity.ok(meetings);
    }

    @GetMapping("/timerange")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Meeting>> getMeetingsInTimeRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<Meeting> meetings = meetingService.getMeetingsInTimeRange(start, end);
        return ResponseEntity.ok(meetings);
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Meeting>> searchMeetings(@RequestParam String keyword) {
        List<Meeting> meetings = meetingService.searchMeetings(keyword);
        return ResponseEntity.ok(meetings);
    }

    @PostMapping("/{id}/participants")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Meeting> addParticipants(@PathVariable Long id, @RequestBody Set<User> participants) {
        Meeting updatedMeeting = meetingService.addParticipants(id, participants);
        return ResponseEntity.ok(updatedMeeting);
    }

    @DeleteMapping("/{id}/participants/{participantId}")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Meeting> removeParticipant(@PathVariable Long id, @PathVariable User participant) {
        Meeting updatedMeeting = meetingService.removeParticipant(id, participant);
        return ResponseEntity.ok(updatedMeeting);
    }
} 