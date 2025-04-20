package com.tunisair.meeting.controller;

import com.tunisair.meeting.models.Meeting;
import com.tunisair.meeting.models.MeetingMinutes;
import com.tunisair.meeting.models.User;
import com.tunisair.meeting.service.MeetingMinutesService;
import com.tunisair.meeting.service.MeetingService;
import com.tunisair.meeting.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meeting-minutes")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MeetingMinutesController {

    @Autowired
    private MeetingMinutesService meetingMinutesService;

    @Autowired
    private MeetingService meetingService;

    @Autowired
    private UserService userService;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<MeetingMinutes> createMeetingMinutes(
            @RequestParam Long meetingId,
            @RequestParam String content) {
        Meeting meeting = meetingService.getMeetingById(meetingId);
        User currentUser = userService.getCurrentUser();
        MeetingMinutes minutes = meetingMinutesService.createMeetingMinutes(meeting, content, currentUser);
        return ResponseEntity.ok(minutes);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<MeetingMinutes> updateMeetingMinutes(
            @PathVariable Long id,
            @RequestParam String content) {
        User currentUser = userService.getCurrentUser();
        MeetingMinutes minutes = meetingMinutesService.updateMeetingMinutes(id, content, currentUser);
        return ResponseEntity.ok(minutes);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<MeetingMinutes> getMeetingMinutesById(@PathVariable Long id) {
        MeetingMinutes minutes = meetingMinutesService.getMeetingMinutesById(id);
        return ResponseEntity.ok(minutes);
    }

    @GetMapping("/meeting/{meetingId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<MeetingMinutes> getMeetingMinutesByMeeting(@PathVariable Long meetingId) {
        Meeting meeting = meetingService.getMeetingById(meetingId);
        MeetingMinutes minutes = meetingMinutesService.getMeetingMinutesByMeeting(meeting);
        return ResponseEntity.ok(minutes);
    }

    @GetMapping("/my-minutes")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<MeetingMinutes>> getMyMeetingMinutes() {
        User currentUser = userService.getCurrentUser();
        List<MeetingMinutes> minutes = meetingMinutesService.getMeetingMinutesByUser(currentUser);
        return ResponseEntity.ok(minutes);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMeetingMinutes(@PathVariable Long id) {
        meetingMinutesService.deleteMeetingMinutes(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<MeetingMinutes> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        User currentUser = userService.getCurrentUser();
        MeetingMinutes minutes = meetingMinutesService.updateStatus(id, status, currentUser);
        return ResponseEntity.ok(minutes);
    }

    @PutMapping("/{id}/visibility")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<MeetingMinutes> updateVisibility(
            @PathVariable Long id,
            @RequestParam boolean isPublic) {
        MeetingMinutes minutes = meetingMinutesService.updateVisibility(id, isPublic);
        return ResponseEntity.ok(minutes);
    }

    @GetMapping("/public")
    public ResponseEntity<List<MeetingMinutes>> getPublicMeetingMinutes() {
        List<MeetingMinutes> minutes = meetingMinutesService.getPublicMeetingMinutes();
        return ResponseEntity.ok(minutes);
    }
} 