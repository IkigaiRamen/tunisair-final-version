package com.tunisair.meeting.repository;

import com.tunisair.meeting.models.Meeting;
import com.tunisair.meeting.models.MeetingMinutes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingMinutesRepository extends JpaRepository<MeetingMinutes, Long> {
    MeetingMinutes findByMeeting(Meeting meeting);
    List<MeetingMinutes> findByCreatedByOrderByCreatedAtDesc(User user);
    List<MeetingMinutes> findByStatus(String status);
    List<MeetingMinutes> findByIsPublicTrue();
} 