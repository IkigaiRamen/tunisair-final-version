package com.tunisair.meetingmanagement.repository;

import com.tunisair.meetingmanagement.model.Decision;
import com.tunisair.meetingmanagement.model.Meeting;
import com.tunisair.meetingmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DecisionRepository extends JpaRepository<Decision, Long> {
    List<Decision> findByMeeting(Meeting meeting);
    List<Decision> findByResponsibleUser(User user);
    List<Decision> findByDeadlineBetween(LocalDateTime start, LocalDateTime end);
    List<Decision> findByDeadlineAfter(LocalDateTime dateTime);
    List<Decision> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
} 