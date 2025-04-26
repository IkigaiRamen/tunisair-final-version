package com.tunisair.meetingmanagement.service;

import com.tunisair.meetingmanagement.model.Decision;
import com.tunisair.meetingmanagement.model.Task;
import com.tunisair.meetingmanagement.model.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TaskService {
    List<Task> getAllTasks();
    Optional<Task> getTaskById(Long id);
    Task createTask(Task task);
    Task updateTask(Long id, Task taskDetails);
    void deleteTask(Long id);
    List<Task> getTasksByDecisionId(Long id);
    List<Task> getTasksByDecision(Decision decision);

    List<Task> getTaskByDecisionId(Long id);

    List<Task> getTasksByAssignedUser(User user);
    List<Task> getTasksByStatus(Task.TaskStatus status);
    List<Task> getTasksByDeadlineRange(LocalDateTime start, LocalDateTime end);
    Task assignTask(Long taskId, Long userId);
    Task updateTaskStatus(Long taskId, Task.TaskStatus status);
    Task updateTaskDeadline(Long taskId, LocalDateTime newDeadline);
} 