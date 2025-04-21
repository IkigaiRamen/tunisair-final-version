package com.tunisair.meetingmanagement.repository;

import com.tunisair.meetingmanagement.model.Meeting;
import com.tunisair.meetingmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Long> {
    List<Meeting> findByCreatedBy(User user);
    List<Meeting> findByParticipantsContaining(User user);
    List<Meeting> findByDateTimeBetween(LocalDateTime start, LocalDateTime end);
    List<Meeting> findByTitleContainingIgnoreCase(String title);
    Set<Meeting> findByParticipants_Id(Long userId);
} 