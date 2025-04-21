package com.tunisair.meetingmanagement.service;

import com.tunisair.meetingmanagement.model.Meeting;
import com.tunisair.meetingmanagement.model.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface MeetingService {
    List<Meeting> getAllMeetings();
    Optional<Meeting> getMeetingById(Long id);
    Meeting createMeeting(Meeting meeting);
    Meeting updateMeeting(Long id, Meeting meetingDetails);
    void deleteMeeting(Long id);
    List<Meeting> getMeetingsByCreator(User user);
    List<Meeting> getMeetingsByParticipant(User user);
    List<Meeting> getMeetingsByDateRange(LocalDateTime start, LocalDateTime end);
    List<Meeting> searchMeetingsByTitle(String title);
    Set<Meeting> getMeetingsByParticipantId(Long userId);
    Meeting addParticipant(Long meetingId, Long userId);
    Meeting removeParticipant(Long meetingId, Long userId);
} 