package com.tunisair.meetingmanagement.service.impl;

import com.tunisair.meetingmanagement.model.Meeting;
import com.tunisair.meetingmanagement.model.User;
import com.tunisair.meetingmanagement.service.ReportService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ReportServiceImpl implements ReportService {

    @Override
    public byte[] generateMeetingReport(Meeting meeting) {
        // dummy implementation
        return new byte[0];
    }

    @Override
    public byte[] generateUserActivityReport(User user, LocalDateTime start, LocalDateTime end) {
        return new byte[0];
    }

    @Override
    public byte[] generateTaskCompletionReport(LocalDateTime start, LocalDateTime end) {
        return new byte[0];
    }

    @Override
    public byte[] generateDecisionImplementationReport(LocalDateTime start, LocalDateTime end) {
        return new byte[0];
    }

    @Override
    public byte[] generateMeetingAttendanceReport(Meeting meeting) {
        return new byte[0];
    }

    @Override
    public byte[] generateTaskAssignmentReport(User user) {
        return new byte[0];
    }

    @Override
    public byte[] generateDecisionDeadlineReport(LocalDateTime start, LocalDateTime end) {
        return new byte[0];
    }
}
