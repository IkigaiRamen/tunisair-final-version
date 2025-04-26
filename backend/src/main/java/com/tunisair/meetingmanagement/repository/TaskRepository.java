package com.tunisair.meetingmanagement.repository;

import com.tunisair.meetingmanagement.model.Decision;
import com.tunisair.meetingmanagement.model.Task;
import com.tunisair.meetingmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedTo(User user);
    List<Task> findByStatus(Task.TaskStatus status);
    List<Task> findByDeadlineBetween(LocalDateTime start, LocalDateTime end);
    List<Task> findByDeadlineBefore(LocalDateTime dateTime);
    List<Task> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<Task> findByAssignedTo_IdAndStatus(Long userId, Task.TaskStatus status);
    List<Task> findByDecision(Decision decision);
    // These are the additional methods that you can implement for the missing functionality:
    List<Task> findByAssignedToAndStatus(User user, Task.TaskStatus status);    List<Task> findByDeadlineBetweenAndStatus(LocalDateTime start, LocalDateTime end, Task.TaskStatus status); // Tasks in a date range with specific status
    List<Task> findByDeadlineBeforeAndStatus(LocalDateTime dateTime, Task.TaskStatus status); // Find tasks due before a date with specific status

    List<Task> findByDecisionId(Long id);
}
