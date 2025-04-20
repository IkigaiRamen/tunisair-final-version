package com.tunisair.meeting.service;

import com.tunisair.meeting.models.Meeting;
import com.tunisair.meeting.models.MeetingMinutes;
import com.tunisair.meeting.models.User;

import java.util.List;

public interface MeetingMinutesService {
    MeetingMinutes createMeetingMinutes(Meeting meeting, String content, User createdBy);
    MeetingMinutes updateMeetingMinutes(Long id, String content, User modifiedBy);
    MeetingMinutes getMeetingMinutesById(Long id);
    MeetingMinutes getMeetingMinutesByMeeting(Meeting meeting);
    List<MeetingMinutes> getMeetingMinutesByUser(User user);
    void deleteMeetingMinutes(Long id);
    MeetingMinutes updateStatus(Long id, String status, User modifiedBy);
    MeetingMinutes updateVisibility(Long id, boolean isPublic);
    List<MeetingMinutes> getPublicMeetingMinutes();
} 