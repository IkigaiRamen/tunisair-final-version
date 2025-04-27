package com.tunisair.meetingmanagement.controller;

import com.tunisair.meetingmanagement.model.Meeting;
import com.tunisair.meetingmanagement.model.User;
import com.tunisair.meetingmanagement.service.MeetingService;
import com.tunisair.meetingmanagement.service.ReportService;
import com.tunisair.meetingmanagement.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Report Management", description = "Report management APIs")
public class ReportController {

    private final ReportService reportService;
    private final MeetingService meetingService;
    private final UserService userService;

    @Operation(summary = "Generate meeting report")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Report generated successfully"),
        @ApiResponse(responseCode = "404", description = "Meeting not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/meeting/{id}/report")
    public ResponseEntity<byte[]> downloadMeetingReport(
            @PathVariable Long id,
            @RequestParam(defaultValue = "xlsx") String format
    ) {
        Optional<Meeting> meeting = meetingService.getMeetingById(id);

        byte[] report;
        String filename;
        MediaType mediaType;

        if ("pdf".equalsIgnoreCase(format)) {
            report = reportService.generateMeetingReportPDF(meeting);
            filename = "meeting_report.pdf";
            mediaType = MediaType.APPLICATION_PDF;
        } else {
            report = reportService.generateMeetingReportExcel(meeting);
            filename = "meeting_report.xlsx";
            mediaType = MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(mediaType)
                .body(report);
    }


    @Operation(summary = "Generate user activity report")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Report generated successfully"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/user-activity/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY')")
    public ResponseEntity<byte[]> generateUserActivityReport(
            @PathVariable Long userId,
            @Parameter(description = "Start date (yyyy-MM-dd'T'HH:mm:ss)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @Parameter(description = "End date (yyyy-MM-dd'T'HH:mm:ss)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        byte[] report = reportService.generateUserActivityReport(user, start, end);
        return createResponseEntity(report, "user_activity_report.pdf");
    }

    @Operation(summary = "Generate task completion report")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Report generated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid date range"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/task-completion")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY')")
    public ResponseEntity<byte[]> generateTaskCompletionReport(
            @Parameter(description = "Start date (yyyy-MM-dd'T'HH:mm:ss)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @Parameter(description = "End date (yyyy-MM-dd'T'HH:mm:ss)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        byte[] report = reportService.generateTaskCompletionReport(start, end);
        return createResponseEntity(report, "task_completion_report.pdf");
    }

    @Operation(summary = "Generate decision implementation report")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Report generated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid date range"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/decision-implementation")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY')")
    public ResponseEntity<byte[]> generateDecisionImplementationReport(
            @Parameter(description = "Start date (yyyy-MM-dd'T'HH:mm:ss)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @Parameter(description = "End date (yyyy-MM-dd'T'HH:mm:ss)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        byte[] report = reportService.generateDecisionImplementationReport(start, end);
        return createResponseEntity(report, "decision_implementation_report.pdf");
    }

    @Operation(summary = "Generate meeting attendance report")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Report generated successfully"),
        @ApiResponse(responseCode = "404", description = "Meeting not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/meeting-attendance/{meetingId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY')")
    public ResponseEntity<byte[]> generateMeetingAttendanceReport(@PathVariable Long meetingId) {
        Meeting meeting = meetingService.getMeetingById(meetingId)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));
        byte[] report = reportService.generateMeetingAttendanceReport(meeting);
        return createResponseEntity(report, "meeting_attendance_report.pdf");
    }

    @Operation(summary = "Generate task assignment report")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Report generated successfully"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/task-assignment/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY')")
    public ResponseEntity<byte[]> generateTaskAssignmentReport(@PathVariable Long userId) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        byte[] report = reportService.generateTaskAssignmentReport(user);
        return createResponseEntity(report, "task_assignment_report.pdf");
    }

    @Operation(summary = "Generate decision deadline report")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Report generated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid date range"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/decision-deadlines")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY')")
    public ResponseEntity<byte[]> generateDecisionDeadlineReport(
            @Parameter(description = "Start date (yyyy-MM-dd'T'HH:mm:ss)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @Parameter(description = "End date (yyyy-MM-dd'T'HH:mm:ss)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        byte[] report = reportService.generateDecisionDeadlineReport(start, end);
        return createResponseEntity(report, "decision_deadline_report.pdf");
    }

    private ResponseEntity<byte[]> createResponseEntity(byte[] report, String filename) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(report.length)
                .body(report);
    }
} 