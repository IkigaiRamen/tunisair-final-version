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

    @EntityGraph(value = "Decision.withTasks")
    List<Decision> findByMeeting(Meeting meeting);

    @EntityGraph(value = "Decision.withTasks")
    List<Decision> findByResponsibleUser(User user);

    @EntityGraph(value = "Decision.withTasks")
    List<Decision> findByDeadlineBetween(LocalDateTime start, LocalDateTime end);

    @EntityGraph(value = "Decision.withTasks")
    List<Decision> findByDeadlineAfter(LocalDateTime dateTime);

    @EntityGraph(value = "Decision.withTasks")
    List<Decision> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
} 