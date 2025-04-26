package com.tunisair.meetingmanagement.service.impl;

import com.tunisair.meetingmanagement.model.Decision;
import com.tunisair.meetingmanagement.model.Task;
import com.tunisair.meetingmanagement.model.User;
import com.tunisair.meetingmanagement.repository.TaskRepository;
import com.tunisair.meetingmanagement.repository.UserRepository;
import com.tunisair.meetingmanagement.service.NotificationService;
import com.tunisair.meetingmanagement.service.TaskService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    // Inject your existing notification method
    private final NotificationService notificationService;  // Assuming your notification method is in this service

    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    @Override
    public Task createTask(Task task) {
        // Check if task has a decision and add this task to the decision's task list
        if (task.getDecision() != null) {
            task.getDecision().getTasks().add(task); // Add task to the decision's tasks collection
        }

        // Save the task and return it
        return taskRepository.save(task);
    }

    @Override
    public Task updateTask(Long id, Task taskDetails) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));

        task.setDescription(taskDetails.getDescription());
        task.setDeadline(taskDetails.getDeadline());
        task.setStatus(taskDetails.getStatus());
        task.setDecision(taskDetails.getDecision());

        return taskRepository.save(task);
    }

    @Override
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    @Override
    public List<Task> getTasksByDecision(Decision decision) {
        return taskRepository.findByDecision(decision);
    }

    @Override
    public List<Task> getTaskByDecisionId(Long id) {
        return taskRepository.findByDecisionId(id);
    }

    @Override
    public List<Task> getTasksByAssignedUser(User user) {
        return taskRepository.findByAssignedTo(user);
    }

    @Override
    public List<Task> getTasksByStatus(Task.TaskStatus status) {
        return taskRepository.findByStatus(status);
    }

    @Override
    public List<Task> getTasksByDeadlineRange(LocalDateTime start, LocalDateTime end) {
        return taskRepository.findByDeadlineBetween(start, end);
    }

    public List<Task> getTasksByDecisionId(Long decisionId) {
        return taskRepository.findByDecisionId(decisionId);  // Adjust according to your repository query method
    }

    @Override
    public Task assignTask(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        task.setAssignedTo(user);
        Task assignedTask = taskRepository.save(task);

        // Send notification for task assignment using the existing method
        notificationService.sendTaskAssignment(user, "Task Assignment", task.getDescription(), task.getDeadline());

        return assignedTask;
    }

    @Override
    public Task updateTaskStatus(Long taskId, Task.TaskStatus status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));

        task.setStatus(status);
        return taskRepository.save(task);
    }

    @Override
    public Task updateTaskDeadline(Long taskId, LocalDateTime newDeadline) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));

        task.setDeadline(newDeadline);
        return taskRepository.save(task);
    }
}