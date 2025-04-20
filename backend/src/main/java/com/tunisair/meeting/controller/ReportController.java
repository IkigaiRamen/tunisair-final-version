package com.tunisair.meeting.controller;

import com.tunisair.meeting.models.Meeting;
import com.tunisair.meeting.models.User;
import com.tunisair.meeting.service.MeetingService;
import com.tunisair.meeting.service.ReportService;
import com.tunisair.meeting.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private MeetingService meetingService;

    @Autowired
    private UserService userService;

    @GetMapping("/meeting/{meetingId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Resource> generateMeetingReport(@PathVariable Long meetingId) {
        Meeting meeting = meetingService.getMeetingById(meetingId);
        Resource report = reportService.generateMeetingReport(meeting);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=meeting-report.pdf")
                .body(report);
    }

    @GetMapping("/tasks")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Resource> generateTaskReport() {
        User currentUser = userService.getCurrentUser();
        List<Task> tasks = taskService.getTasksByAssignee(currentUser);
        Resource report = reportService.generateTaskReport(tasks);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=tasks-report.xlsx")
                .body(report);
    }

    @GetMapping("/user-activity")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Resource> generateUserActivityReport(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        User currentUser = userService.getCurrentUser();
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        Resource report = reportService.generateUserActivityReport(currentUser, start, end);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=user-activity-report.pdf")
                .body(report);
    }

    @GetMapping("/meeting-minutes/{meetingId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Resource> generateMeetingMinutesReport(@PathVariable Long meetingId) {
        Meeting meeting = meetingService.getMeetingById(meetingId);
        Resource report = reportService.generateMeetingMinutesReport(meeting);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=meeting-minutes.pdf")
                .body(report);
    }

    @GetMapping("/decisions/{meetingId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Resource> generateDecisionReport(@PathVariable Long meetingId) {
        Meeting meeting = meetingService.getMeetingById(meetingId);
        Resource report = reportService.generateDecisionReport(meeting);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=decisions-report.pdf")
                .body(report);
    }

    @GetMapping("/documents/{meetingId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Resource> generateDocumentReport(@PathVariable Long meetingId) {
        Meeting meeting = meetingService.getMeetingById(meetingId);
        Resource report = reportService.generateDocumentReport(meeting);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=documents-report.pdf")
                .body(report);
    }

    @GetMapping("/combined/{meetingId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Resource> generateCombinedReport(@PathVariable Long meetingId) {
        Meeting meeting = meetingService.getMeetingById(meetingId);
        Resource report = reportService.generateCombinedReport(meeting);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=meeting-summary-report.pdf")
                .body(report);
    }
} 