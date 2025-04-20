package com.tunisair.meeting.controllers;

import com.tunisair.meeting.models.Decision;
import com.tunisair.meeting.models.Meeting;
import com.tunisair.meeting.models.User;
import com.tunisair.meeting.service.DecisionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/decisions")
public class DecisionController {
    @Autowired
    private DecisionService decisionService;

    @PostMapping
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Decision> createDecision(@Valid @RequestBody Decision decision) {
        Decision createdDecision = decisionService.createDecision(decision);
        return ResponseEntity.ok(createdDecision);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Decision> getDecision(@PathVariable Long id) {
        return decisionService.getDecisionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Decision>> getAllDecisions() {
        List<Decision> decisions = decisionService.getAllDecisions();
        return ResponseEntity.ok(decisions);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Decision> updateDecision(@PathVariable Long id, @Valid @RequestBody Decision decision) {
        decision.setId(id);
        Decision updatedDecision = decisionService.updateDecision(decision);
        return ResponseEntity.ok(updatedDecision);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteDecision(@PathVariable Long id) {
        decisionService.deleteDecision(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/meeting/{meetingId}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Decision>> getDecisionsByMeeting(@PathVariable Meeting meeting) {
        List<Decision> decisions = decisionService.getDecisionsByMeeting(meeting);
        return ResponseEntity.ok(decisions);
    }

    @GetMapping("/proposer/{proposerId}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Decision>> getDecisionsByProposer(@PathVariable User proposedBy) {
        List<Decision> decisions = decisionService.getDecisionsByProposer(proposedBy);
        return ResponseEntity.ok(decisions);
    }

    @GetMapping("/timerange")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Decision>> getDecisionsInTimeRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<Decision> decisions = decisionService.getDecisionsInTimeRange(start, end);
        return ResponseEntity.ok(decisions);
    }

    @GetMapping("/meeting/{meetingId}/latest")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Decision>> getLatestDecisionsByMeeting(@PathVariable Meeting meeting) {
        List<Decision> decisions = decisionService.getLatestDecisionsByMeeting(meeting);
        return ResponseEntity.ok(decisions);
    }
} 