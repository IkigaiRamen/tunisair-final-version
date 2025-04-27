package com.tunisair.meetingmanagement.service;

import com.tunisair.meetingmanagement.model.Meeting;
import com.tunisair.meetingmanagement.model.User;

import java.time.LocalDateTime;
import java.util.Optional;

public interface ReportService {
    byte[] generateMeetingReportExcel(Optional<Meeting> meeting);
    byte[] generateMeetingReportPDF(Optional<Meeting> meeting);
    byte[] generateUserActivityReport(User user, LocalDateTime start, LocalDateTime end);
    byte[] generateTaskCompletionReport(LocalDateTime start, LocalDateTime end);
    byte[] generateDecisionImplementationReport(LocalDateTime start, LocalDateTime end);
    byte[] generateMeetingAttendanceReport(Meeting meeting);
    byte[] generateTaskAssignmentReport(User user);
    byte[] generateDecisionDeadlineReport(LocalDateTime start, LocalDateTime end);
} 