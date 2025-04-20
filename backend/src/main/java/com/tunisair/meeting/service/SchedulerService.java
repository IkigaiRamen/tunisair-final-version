package com.tunisair.meeting.service;

import com.tunisair.meeting.models.Meeting;
import com.tunisair.meeting.models.Task;

public interface SchedulerService {
    void scheduleMeetingReminder(Meeting meeting);
    void scheduleTaskReminder(Task task);
    void cancelMeetingReminder(Long meetingId);
    void cancelTaskReminder(Long taskId);
    void rescheduleMeetingReminder(Meeting meeting);
    void rescheduleTaskReminder(Task task);
} 