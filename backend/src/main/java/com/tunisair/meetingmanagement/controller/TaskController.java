package com.tunisair.meetingmanagement.controller;

import com.tunisair.meetingmanagement.model.Decision;
import com.tunisair.meetingmanagement.model.Task;
import com.tunisair.meetingmanagement.model.User;
import com.tunisair.meetingmanagement.service.DecisionService;
import com.tunisair.meetingmanagement.service.TaskService;
import com.tunisair.meetingmanagement.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Task Management", description = "Task management APIs")
public class TaskController {

    private final TaskService taskService;
    private final DecisionService decisionService;
    private final UserService userService;

    @Operation(summary = "Get all tasks")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved all tasks"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY', 'BOARD_MEMBER')")
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @Operation(summary = "Get task by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved task"),
        @ApiResponse(responseCode = "404", description = "Task not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY', 'BOARD_MEMBER')")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Create new task")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Task created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY')")
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        return ResponseEntity.ok(taskService.createTask(task));
    }

    @Operation(summary = "Update task")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Task updated successfully"),
        @ApiResponse(responseCode = "404", description = "Task not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY')")
    public ResponseEntity<Task> updateTask(
            @PathVariable Long id,
            @RequestBody Task taskDetails) {
        return ResponseEntity.ok(taskService.updateTask(id, taskDetails));
    }

    @Operation(summary = "Delete task")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Task deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Task not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Get tasks by decision")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved decision tasks"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/decision/{decisionId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY', 'BOARD_MEMBER')")
    public ResponseEntity<List<Task>> getTasksByDecision(@PathVariable Long decisionId) {
        Decision decision = decisionService.getDecisionById(decisionId)
                .orElseThrow(() -> new RuntimeException("Decision not found"));
        return ResponseEntity.ok(taskService.getTasksByDecision(decision));
    }

    @Operation(summary = "Get tasks by assigned user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved user tasks"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY', 'BOARD_MEMBER')")
    public ResponseEntity<List<Task>> getTasksByAssignedUser(@PathVariable Long userId) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(taskService.getTasksByAssignedUser(user));
    }

    @Operation(summary = "Get tasks by status")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved tasks by status"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY', 'BOARD_MEMBER')")
    public ResponseEntity<List<Task>> getTasksByStatus(
            @Parameter(description = "Task status (IN_PROGRESS, COMPLETED, PENDING)")
            @PathVariable Task.TaskStatus status) {
        return ResponseEntity.ok(taskService.getTasksByStatus(status));
    }

    @Operation(summary = "Get tasks by deadline range")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved tasks in range"),
        @ApiResponse(responseCode = "400", description = "Invalid date range"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/deadline-range")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY', 'BOARD_MEMBER')")
    public ResponseEntity<List<Task>> getTasksByDeadlineRange(
            @Parameter(description = "Start date (yyyy-MM-dd'T'HH:mm:ss)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @Parameter(description = "End date (yyyy-MM-dd'T'HH:mm:ss)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(taskService.getTasksByDeadlineRange(start, end));
    }

    @Operation(summary = "Assign task to user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Task assigned successfully"),
        @ApiResponse(responseCode = "404", description = "Task or user not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PutMapping("/{taskId}/assign/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY')")
    public ResponseEntity<Task> assignTask(
            @PathVariable Long taskId,
            @PathVariable Long userId) {
        return ResponseEntity.ok(taskService.assignTask(taskId, userId));
    }

    @Operation(summary = "Update task status")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Status updated successfully"),
        @ApiResponse(responseCode = "404", description = "Task not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PutMapping("/{taskId}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY', 'BOARD_MEMBER')")
    public ResponseEntity<Task> updateTaskStatus(
            @PathVariable Long taskId,
            @Parameter(description = "New task status (IN_PROGRESS, COMPLETED, PENDING)")
            @RequestParam Task.TaskStatus status) {
        return ResponseEntity.ok(taskService.updateTaskStatus(taskId, status));
    }

    @Operation(summary = "Update task deadline")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Deadline updated successfully"),
        @ApiResponse(responseCode = "404", description = "Task not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PutMapping("/{taskId}/deadline")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY')")
    public ResponseEntity<Task> updateTaskDeadline(
            @PathVariable Long taskId,
            @Parameter(description = "New deadline (yyyy-MM-dd'T'HH:mm:ss)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime newDeadline) {
        return ResponseEntity.ok(taskService.updateTaskDeadline(taskId, newDeadline));
    }
} 