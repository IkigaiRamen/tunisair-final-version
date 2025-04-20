package com.tunisair.meeting.service.impl;

import com.tunisair.meeting.models.Meeting;
import com.tunisair.meeting.models.MeetingMinutes;
import com.tunisair.meeting.models.User;
import com.tunisair.meeting.repository.MeetingMinutesRepository;
import com.tunisair.meeting.service.MeetingMinutesService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MeetingMinutesServiceImpl implements MeetingMinutesService {

    private final MeetingMinutesRepository meetingMinutesRepository;

    @Autowired
    public MeetingMinutesServiceImpl(MeetingMinutesRepository meetingMinutesRepository) {
        this.meetingMinutesRepository = meetingMinutesRepository;
    }

    @Override
    @Transactional
    public MeetingMinutes createMeetingMinutes(Meeting meeting, String content, User createdBy) {
        MeetingMinutes minutes = new MeetingMinutes();
        minutes.setMeeting(meeting);
        minutes.setContent(content);
        minutes.setCreatedBy(createdBy);
        minutes.setCreatedAt(LocalDateTime.now());
        minutes.setStatus("DRAFT");
        minutes.setPublic(false);
        return meetingMinutesRepository.save(minutes);
    }

    @Override
    @Transactional
    public MeetingMinutes updateMeetingMinutes(Long id, String content, User modifiedBy) {
        MeetingMinutes minutes = getMeetingMinutesById(id);
        minutes.setContent(content);
        minutes.setModifiedBy(modifiedBy);
        minutes.setModifiedAt(LocalDateTime.now());
        return meetingMinutesRepository.save(minutes);
    }

    @Override
    public MeetingMinutes getMeetingMinutesById(Long id) {
        return meetingMinutesRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Meeting minutes not found with id: " + id));
    }

    @Override
    public MeetingMinutes getMeetingMinutesByMeeting(Meeting meeting) {
        return meetingMinutesRepository.findByMeeting(meeting)
                .orElse(null);
    }

    @Override
    public List<MeetingMinutes> getMeetingMinutesByUser(User user) {
        return meetingMinutesRepository.findByCreatedBy(user);
    }

    @Override
    @Transactional
    public void deleteMeetingMinutes(Long id) {
        MeetingMinutes minutes = getMeetingMinutesById(id);
        meetingMinutesRepository.delete(minutes);
    }

    @Override
    @Transactional
    public MeetingMinutes updateStatus(Long id, String status, User modifiedBy) {
        MeetingMinutes minutes = getMeetingMinutesById(id);
        minutes.setStatus(status);
        minutes.setModifiedBy(modifiedBy);
        minutes.setModifiedAt(LocalDateTime.now());
        return meetingMinutesRepository.save(minutes);
    }

    @Override
    @Transactional
    public MeetingMinutes updateVisibility(Long id, boolean isPublic) {
        MeetingMinutes minutes = getMeetingMinutesById(id);
        minutes.setPublic(isPublic);
        return meetingMinutesRepository.save(minutes);
    }

    @Override
    public List<MeetingMinutes> getPublicMeetingMinutes() {
        return meetingMinutesRepository.findByIsPublicTrue();
    }
} 