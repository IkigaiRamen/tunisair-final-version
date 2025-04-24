package com.tunisair.meetingmanagement.service.impl;

import com.tunisair.meetingmanagement.model.Meeting;
import com.tunisair.meetingmanagement.model.User;
import com.tunisair.meetingmanagement.repository.MeetingRepository;
import com.tunisair.meetingmanagement.repository.UserRepository;
import com.tunisair.meetingmanagement.service.MeetingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MeetingServiceImpl implements MeetingService {

    private final MeetingRepository meetingRepository;
    private final UserRepository userRepository;

    @Override
    public List<Meeting> getAllMeetings() {
        return meetingRepository.findAll();
    }

    @Override
    public Optional<Meeting> getMeetingById(Long id) {
        return meetingRepository.findById(id);
    }

    @Override
    @Transactional
    public Meeting createMeeting(Meeting meeting) {
        return meetingRepository.save(meeting);
    }

    @Override
    @Transactional
    public Meeting updateMeeting(Long id, Meeting meetingDetails) {
        Meeting meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meeting not found with id: " + id));

        meeting.setTitle(meetingDetails.getTitle());
        meeting.setAgenda(meetingDetails.getAgenda());
        meeting.setObjectives(meetingDetails.getObjectives());
        meeting.setDateTime(meetingDetails.getDateTime());

        return meetingRepository.save(meeting);
    }

    @Override
    @Transactional
    public void deleteMeeting(Long id) {
        Meeting meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meeting not found with id: " + id));
        meetingRepository.delete(meeting);
    }

    @Override
    public List<Meeting> getMeetingsByCreator(User user) {
        return meetingRepository.findByCreatedBy(user);
    }

    @Override
    public List<Meeting> getMeetingsByParticipant(User user) {
        return meetingRepository.findByParticipantsContaining(user);
    }

    @Override
    public List<Meeting> getMeetingsByDateRange(LocalDateTime start, LocalDateTime end) {
        return meetingRepository.findByDateTimeBetween(start, end);
    }

    @Override
    public List<Meeting> getUpcomingMeetings(LocalDateTime start) {
        return meetingRepository.findByDateTimeAfter(start);
    }

    @Override
    public List<Meeting> getPastMeetings(LocalDateTime start) {
        return meetingRepository.findByDateTimeBefore(start);
    }



    @Override
    public List<Meeting> searchMeetingsByTitle(String title) {
        return meetingRepository.findByTitleContainingIgnoreCase(title);
    }

    @Override
    public Set<Meeting> getMeetingsByParticipantId(Long userId) {
        return meetingRepository.findByParticipants_Id(userId);
    }

    @Override
    @Transactional
    public Meeting addParticipant(Long meetingId, Long userId) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new RuntimeException("Meeting not found with id: " + meetingId));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        meeting.getParticipants().add(user);
        return meetingRepository.save(meeting);
    }

    @Override
    @Transactional
    public Meeting removeParticipant(Long meetingId, Long userId) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new RuntimeException("Meeting not found with id: " + meetingId));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        meeting.getParticipants().remove(user);
        return meetingRepository.save(meeting);
    }
} 