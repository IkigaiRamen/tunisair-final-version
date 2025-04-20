package com.tunisair.meeting.service;

import com.tunisair.meeting.models.Meeting;
import com.tunisair.meeting.models.User;
import com.tunisair.meeting.repository.MeetingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class MeetingService {
    @Autowired
    private MeetingRepository meetingRepository;

    @Transactional
    public Meeting createMeeting(Meeting meeting) {
        return meetingRepository.save(meeting);
    }

    @Transactional(readOnly = true)
    public Optional<Meeting> getMeetingById(Long id) {
        return meetingRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Meeting> getAllMeetings() {
        return meetingRepository.findAll();
    }

    @Transactional
    public Meeting updateMeeting(Meeting meeting) {
        return meetingRepository.save(meeting);
    }

    @Transactional
    public void deleteMeeting(Long id) {
        meetingRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Meeting> getMeetingsByOrganizer(User organizer) {
        return meetingRepository.findByOrganizer(organizer);
    }

    @Transactional(readOnly = true)
    public List<Meeting> getMeetingsByParticipant(User participant) {
        return meetingRepository.findByParticipantsContaining(participant);
    }

    @Transactional(readOnly = true)
    public List<Meeting> getMeetingsInTimeRange(LocalDateTime start, LocalDateTime end) {
        return meetingRepository.findMeetingsInTimeRange(start, end);
    }

    @Transactional(readOnly = true)
    public List<Meeting> searchMeetings(String keyword) {
        return meetingRepository.searchMeetings(keyword);
    }

    @Transactional
    public Meeting addParticipants(Long meetingId, Set<User> participants) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));
        meeting.getParticipants().addAll(participants);
        return meetingRepository.save(meeting);
    }

    @Transactional
    public Meeting removeParticipant(Long meetingId, User participant) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));
        meeting.getParticipants().remove(participant);
        return meetingRepository.save(meeting);
    }
} 