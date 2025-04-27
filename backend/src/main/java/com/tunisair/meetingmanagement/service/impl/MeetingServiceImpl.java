package com.tunisair.meetingmanagement.service.impl;

import com.tunisair.meetingmanagement.model.Meeting;
import com.tunisair.meetingmanagement.model.User;
import com.tunisair.meetingmanagement.repository.MeetingRepository;
import com.tunisair.meetingmanagement.repository.UserRepository;
import com.tunisair.meetingmanagement.service.MeetingService;
import com.tunisair.meetingmanagement.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MeetingServiceImpl implements MeetingService {

    private final MeetingRepository meetingRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

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
        Meeting createdMeeting = meetingRepository.save(meeting);

        // Notify all participants
        for (User participant : createdMeeting.getParticipants()) {
            notificationService.sendMeetingInvitation(participant, createdMeeting.getTitle(),
                    createdMeeting.getDateTime());
        }

        return createdMeeting;
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

        // Update participants
        Set<User> updatedParticipants = new HashSet<>();
        if (meetingDetails.getParticipants() != null) {
            for (User participant : meetingDetails.getParticipants()) {
                User existingUser = userRepository.findById(participant.getId())
                        .orElseThrow(() -> new RuntimeException("User not found with id: " + participant.getId()));
                updatedParticipants.add(existingUser);
            }
        }
        meeting.setParticipants(updatedParticipants);

        Meeting updatedMeeting = meetingRepository.save(meeting);

        for (User participant : updatedMeeting.getParticipants()) {
            String subject = "Meeting Updated: " + updatedMeeting.getTitle();
            String description = String.format("The meeting has been updated.\nNew Date & Time: %s\nAgenda: %s",
                    updatedMeeting.getDateTime(), updatedMeeting.getAgenda());
            notificationService.sendTaskAssignment(participant, subject, description, updatedMeeting.getDateTime());
        }

        return updatedMeeting;
    }

    @Override
    @Transactional
    public void deleteMeeting(Long id) {
        Meeting meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meeting not found with id: " + id));

        for (User participant : meeting.getParticipants()) {
            String subject = "Meeting Cancelled: " + meeting.getTitle();
            String description = String.format("The meeting scheduled on %s has been cancelled.",
                    meeting.getDateTime());
            notificationService.sendTaskAssignment(participant, subject, description, LocalDateTime.now());
        }

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
        Meeting updated = meetingRepository.save(meeting);

        // Notify the new participant
        notificationService.sendMeetingInvitation(user, updated.getTitle(), updated.getDateTime());

        return updated;
    }

    @Override
    @Transactional
    public Meeting removeParticipant(Long meetingId, Long userId) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new RuntimeException("Meeting not found with id: " + meetingId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        meeting.getParticipants().remove(user);
        Meeting updated = meetingRepository.save(meeting);

        String subject = "Removed from Meeting: " + updated.getTitle();
        String description = String.format("You have been removed from the meeting scheduled on %s.",
                updated.getDateTime());
        notificationService.sendTaskAssignment(user, subject, description, LocalDateTime.now());

        return updated;
    }

}
