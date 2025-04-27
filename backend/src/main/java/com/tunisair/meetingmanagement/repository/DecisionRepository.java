package com.tunisair.meetingmanagement.repository;

import com.tunisair.meetingmanagement.model.Decision;
import com.tunisair.meetingmanagement.model.Meeting;
import com.tunisair.meetingmanagement.model.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DecisionRepository extends JpaRepository<Decision, Long> {

    @EntityGraph(attributePaths = { "tasks", "meeting", "responsibleUser" })
    List<Decision> findByMeeting(Meeting meeting);

    @EntityGraph(attributePaths = { "tasks", "meeting", "responsibleUser" })
    List<Decision> findByResponsibleUser(User user);

    @EntityGraph(attributePaths = { "tasks", "meeting", "responsibleUser" })
    List<Decision> findByDeadlineBetween(LocalDateTime start, LocalDateTime end);

    @EntityGraph(attributePaths = { "tasks", "meeting", "responsibleUser" })
    List<Decision> findByDeadlineAfter(LocalDateTime dateTime);

    @EntityGraph(attributePaths = { "tasks", "meeting", "responsibleUser" })
    List<Decision> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}