package com.tunisair.meeting.controllers;

import com.tunisair.meeting.models.Decision;
import com.tunisair.meeting.models.Task;
import com.tunisair.meeting.models.TaskStatus;
import com.tunisair.meeting.models.User;
import com.tunisair.meeting.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @PostMapping
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Task> createTask(@Valid @RequestBody Task task) {
        Task createdTask = taskService.createTask(task);
        return ResponseEntity.ok(createdTask);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Task> getTask(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @Valid @RequestBody Task task) {
        task.setId(id);
        Task updatedTask = taskService.updateTask(task);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/decision/{decisionId}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Task>> getTasksByDecision(@PathVariable Decision decision) {
        List<Task> tasks = taskService.getTasksByDecision(decision);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/assignee/{assigneeId}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Task>> getTasksByAssignee(@PathVariable User assignedTo) {
        List<Task> tasks = taskService.getTasksByAssignee(assignedTo);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Task>> getTasksByStatus(@PathVariable TaskStatus status) {
        List<Task> tasks = taskService.getTasksByStatus(status);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/overdue/{status}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Task>> getOverdueTasks(@PathVariable TaskStatus status) {
        List<Task> tasks = taskService.getOverdueTasks(status);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/pending/user/{userId}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Task>> getPendingTasksByUser(@PathVariable User user) {
        List<Task> tasks = taskService.getPendingTasksByUser(user);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/meeting/{meetingId}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Task>> getTasksByMeeting(@PathVariable Long meetingId) {
        List<Task> tasks = taskService.getTasksByMeeting(meetingId);
        return ResponseEntity.ok(tasks);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Task> updateTaskStatus(
            @PathVariable Long id, @RequestBody TaskStatus newStatus) {
        Task updatedTask = taskService.updateTaskStatus(id, newStatus);
        return ResponseEntity.ok(updatedTask);
    }

    @PatchMapping("/{id}/assignee")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Task> reassignTask(
            @PathVariable Long id, @RequestBody User newAssignee) {
        Task updatedTask = taskService.reassignTask(id, newAssignee);
        return ResponseEntity.ok(updatedTask);
    }
} 