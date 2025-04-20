package com.tunisair.meeting.service.impl;

import com.tunisair.meeting.models.Meeting;
import com.tunisair.meeting.models.User;
import com.tunisair.meeting.repository.MeetingRepository;
import com.tunisair.meeting.service.MeetingService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MeetingServiceImpl implements MeetingService {

    private final MeetingRepository meetingRepository;

    @Autowired
    public MeetingServiceImpl(MeetingRepository meetingRepository) {
        this.meetingRepository = meetingRepository;
    }

    @Override
    @Transactional
    public Meeting createMeeting(Meeting meeting) {
        meeting.setCreatedAt(LocalDateTime.now());
        return meetingRepository.save(meeting);
    }

    @Override
    @Transactional
    public Meeting updateMeeting(Long id, Meeting meeting) {
        Meeting existingMeeting = getMeetingById(id);
        
        existingMeeting.setTitle(meeting.getTitle());
        existingMeeting.setAgenda(meeting.getAgenda());
        existingMeeting.setObjectives(meeting.getObjectives());
        existingMeeting.setDateTime(meeting.getDateTime());
        existingMeeting.setLocation(meeting.getLocation());
        
        return meetingRepository.save(existingMeeting);
    }

    @Override
    @Transactional
    public void deleteMeeting(Long id) {
        Meeting meeting = getMeetingById(id);
        meetingRepository.delete(meeting);
    }

    @Override
    public Meeting getMeetingById(Long id) {
        return meetingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Meeting not found with id: " + id));
    }

    @Override
    public List<Meeting> getAllMeetings() {
        return meetingRepository.findAll();
    }

    @Override
    public List<Meeting> getMeetingsByOrganizer(User organizer) {
        return meetingRepository.findByOrganizer(organizer);
    }

    @Override
    public List<Meeting> getMeetingsByParticipant(User participant) {
        return meetingRepository.findByParticipantsContaining(participant);
    }

    @Override
    public List<Meeting> getMeetingsByDateRange(LocalDateTime start, LocalDateTime end) {
        return meetingRepository.findByDateTimeBetween(start, end);
    }

    @Override
    public List<Meeting> getUpcomingMeetings() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime nextDay = now.plusDays(1);
        return meetingRepository.findUpcomingMeetings(now, nextDay);
    }

    @Override
    public List<Meeting> getOverdueMeetings() {
        return meetingRepository.findOverdueMeetings(LocalDateTime.now());
    }

    @Override
    @Transactional
    public Meeting addParticipant(Long meetingId, User participant) {
        Meeting meeting = getMeetingById(meetingId);
        meeting.getParticipants().add(participant);
        return meetingRepository.save(meeting);
    }

    @Override
    @Transactional
    public Meeting removeParticipant(Long meetingId, User participant) {
        Meeting meeting = getMeetingById(meetingId);
        meeting.getParticipants().remove(participant);
        return meetingRepository.save(meeting);
    }

    @Override
    @Transactional
    public Meeting markAsCompleted(Long meetingId) {
        Meeting meeting = getMeetingById(meetingId);
        meeting.setCompleted(true);
        return meetingRepository.save(meeting);
    }
} 