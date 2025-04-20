package com.tunisair.meeting.service;

import com.tunisair.meeting.models.Decision;
import com.tunisair.meeting.models.Task;
import com.tunisair.meeting.models.TaskStatus;
import com.tunisair.meeting.models.User;
import com.tunisair.meeting.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    @Transactional
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    @Transactional(readOnly = true)
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Transactional
    public Task updateTask(Task task) {
        return taskRepository.save(task);
    }

    @Transactional
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Task> getTasksByDecision(Decision decision) {
        return taskRepository.findByDecision(decision);
    }

    @Transactional(readOnly = true)
    public List<Task> getTasksByAssignee(User assignedTo) {
        return taskRepository.findByAssignedTo(assignedTo);
    }

    @Transactional(readOnly = true)
    public List<Task> getTasksByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status);
    }

    @Transactional(readOnly = true)
    public List<Task> getOverdueTasks(TaskStatus status) {
        return taskRepository.findByDueDateBeforeAndStatus(LocalDateTime.now(), status);
    }

    @Transactional(readOnly = true)
    public List<Task> getPendingTasksByUser(User user) {
        return taskRepository.findPendingTasksByUser(user);
    }

    @Transactional(readOnly = true)
    public List<Task> getTasksByMeeting(Long meetingId) {
        return taskRepository.findTasksByMeetingId(meetingId);
    }

    @Transactional
    public Task updateTaskStatus(Long taskId, TaskStatus newStatus) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(newStatus);
        return taskRepository.save(task);
    }

    @Transactional
    public Task reassignTask(Long taskId, User newAssignee) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setAssignedTo(newAssignee);
        return taskRepository.save(task);
    }

    @Transactional
    public Task updateTaskStatus(Long id, TaskStatus status, User modifiedBy) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(status);
        return taskRepository.save(task);
    }

    @Transactional
    public Task updateTaskProgress(Long id, Integer progress, User modifiedBy) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setProgress(progress);
        return taskRepository.save(task);
    }

    @Transactional
    public void addDependency(Long taskId, Long dependencyId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        Task dependency = taskRepository.findById(dependencyId)
                .orElseThrow(() -> new RuntimeException("Dependency task not found"));
        task.addDependency(dependency);
        taskRepository.save(task);
    }

    @Transactional
    public void removeDependency(Long taskId, Long dependencyId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        Task dependency = taskRepository.findById(dependencyId)
                .orElseThrow(() -> new RuntimeException("Dependency task not found"));
        task.removeDependency(dependency);
        taskRepository.save(task);
    }

    @Transactional
    public TaskComment addComment(Long taskId, String content, User user) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        TaskComment comment = new TaskComment(content, user);
        task.addComment(comment);
        return taskRepository.save(task).getComments().stream()
                .filter(c -> c.getContent().equals(content) && c.getUser().equals(user))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Comment not found"));
    }

    @Transactional(readOnly = true)
    public List<TaskHistory> getTaskHistory(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        return task.getHistory();
    }

    @Transactional(readOnly = true)
    public List<TaskComment> getTaskComments(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        return task.getComments();
    }
} 