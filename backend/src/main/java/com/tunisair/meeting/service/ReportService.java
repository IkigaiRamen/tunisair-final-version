package com.tunisair.meeting.service;

import com.tunisair.meeting.models.Meeting;
import com.tunisair.meeting.models.Task;
import com.tunisair.meeting.models.User;
import org.springframework.core.io.Resource;

import java.time.LocalDateTime;
import java.util.List;

public interface ReportService {
    Resource generateMeetingReport(Meeting meeting);
    Resource generateTaskReport(List<Task> tasks);
    Resource generateUserActivityReport(User user, LocalDateTime startDate, LocalDateTime endDate);
    Resource generateMeetingMinutesReport(Meeting meeting);
    Resource generateDecisionReport(Meeting meeting);
    Resource generateDocumentReport(Meeting meeting);
    Resource generateCombinedReport(Meeting meeting);
} 