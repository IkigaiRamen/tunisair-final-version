package com.tunisair.meeting.controller;

import com.tunisair.meeting.models.Decision;
import com.tunisair.meeting.models.Meeting;
import com.tunisair.meeting.models.User;
import com.tunisair.meeting.service.DecisionService;
import com.tunisair.meeting.service.MeetingService;
import com.tunisair.meeting.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/decisions")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DecisionController {

    private final DecisionService decisionService;
    private final MeetingService meetingService;
    private final UserService userService;

    @Autowired
    public DecisionController(DecisionService decisionService, MeetingService meetingService, UserService userService) {
        this.decisionService = decisionService;
        this.meetingService = meetingService;
        this.userService = userService;
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Decision> createDecision(@RequestBody Decision decision, Authentication authentication) {
        User currentUser = userService.getUserByUsername(authentication.getName());
        decision.setProposedBy(currentUser);
        return ResponseEntity.ok(decisionService.createDecision(decision));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Decision> updateDecision(@PathVariable Long id, @RequestBody Decision decision) {
        return ResponseEntity.ok(decisionService.updateDecision(id, decision));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDecision(@PathVariable Long id) {
        decisionService.deleteDecision(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Decision> getDecisionById(@PathVariable Long id) {
        return ResponseEntity.ok(decisionService.getDecisionById(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Decision>> getAllDecisions() {
        return ResponseEntity.ok(decisionService.getAllDecisions());
    }

    @GetMapping("/meeting/{meetingId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Decision>> getDecisionsByMeeting(@PathVariable Long meetingId) {
        Meeting meeting = meetingService.getMeetingById(meetingId);
        return ResponseEntity.ok(decisionService.getDecisionsByMeeting(meeting));
    }

    @GetMapping("/proposer")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Decision>> getDecisionsByProposer(Authentication authentication) {
        User currentUser = userService.getUserByUsername(authentication.getName());
        return ResponseEntity.ok(decisionService.getDecisionsByProposer(currentUser));
    }

    @GetMapping("/meeting/{meetingId}/pending")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Decision>> getPendingDecisionsByMeeting(@PathVariable Long meetingId) {
        Meeting meeting = meetingService.getMeetingById(meetingId);
        return ResponseEntity.ok(decisionService.getPendingDecisionsByMeeting(meeting));
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Decision> markAsCompleted(@PathVariable Long id) {
        return ResponseEntity.ok(decisionService.markAsCompleted(id));
    }
} 