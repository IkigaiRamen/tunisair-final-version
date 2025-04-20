package com.tunisair.meeting.service.impl;

import com.tunisair.meeting.models.*;
import com.tunisair.meeting.repository.TaskCommentRepository;
import com.tunisair.meeting.repository.TaskHistoryRepository;
import com.tunisair.meeting.repository.TaskRepository;
import com.tunisair.meeting.service.TaskService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final TaskHistoryRepository taskHistoryRepository;
    private final TaskCommentRepository taskCommentRepository;

    @Autowired
    public TaskServiceImpl(TaskRepository taskRepository,
                          TaskHistoryRepository taskHistoryRepository,
                          TaskCommentRepository taskCommentRepository) {
        this.taskRepository = taskRepository;
        this.taskHistoryRepository = taskHistoryRepository;
        this.taskCommentRepository = taskCommentRepository;
    }

    @Override
    @Transactional
    public Task createTask(Task task, User createdBy) {
        task.setCreatedBy(createdBy);
        task.setCreatedAt(LocalDateTime.now());
        Task savedTask = taskRepository.save(task);
        
        // Record creation in history
        TaskHistory history = new TaskHistory();
        history.setTask(savedTask);
        history.setUser(createdBy);
        history.setAction("CREATED");
        history.setDescription("Task created");
        taskHistoryRepository.save(history);
        
        return savedTask;
    }

    @Override
    @Transactional
    public Task updateTask(Long id, Task task, User modifiedBy) {
        Task existingTask = getTaskById(id);
        
        // Record changes in history
        if (!existingTask.getTitle().equals(task.getTitle())) {
            recordHistory(existingTask, modifiedBy, "TITLE_CHANGED", 
                existingTask.getTitle(), task.getTitle());
        }
        if (!existingTask.getDescription().equals(task.getDescription())) {
            recordHistory(existingTask, modifiedBy, "DESCRIPTION_CHANGED", 
                existingTask.getDescription(), task.getDescription());
        }
        if (!existingTask.getDeadline().equals(task.getDeadline())) {
            recordHistory(existingTask, modifiedBy, "DEADLINE_CHANGED", 
                existingTask.getDeadline().toString(), task.getDeadline().toString());
        }
        
        existingTask.setTitle(task.getTitle());
        existingTask.setDescription(task.getDescription());
        existingTask.setDeadline(task.getDeadline());
        existingTask.setPriority(task.getPriority());
        
        return taskRepository.save(existingTask);
    }

    @Override
    @Transactional
    public void deleteTask(Long id) {
        Task task = getTaskById(id);
        taskRepository.delete(task);
    }

    @Override
    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + id));
    }

    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public List<Task> getTasksByAssignee(User assignee) {
        return taskRepository.findByAssignedTo(assignee);
    }

    @Override
    public List<Task> getTasksByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status);
    }

    @Override
    public List<Task> getTasksByPriority(TaskPriority priority) {
        return taskRepository.findByPriority(priority);
    }

    @Override
    public List<Task> getOverdueTasks() {
        return taskRepository.findByDueDateBeforeAndStatusNot(LocalDateTime.now(), TaskStatus.COMPLETED);
    }

    @Override
    public List<Task> getTasksByDateRange(LocalDateTime start, LocalDateTime end) {
        return taskRepository.findTasksByUserAndDateRange(null, start, end);
    }

    @Override
    @Transactional
    public Task updateTaskStatus(Long id, TaskStatus status, User modifiedBy) {
        Task task = getTaskById(id);
        TaskStatus oldStatus = task.getStatus();
        
        // Check if all dependencies are completed
        if (status == TaskStatus.IN_PROGRESS || status == TaskStatus.COMPLETED) {
            for (Task dependency : task.getDependencies()) {
                if (dependency.getStatus() != TaskStatus.COMPLETED) {
                    throw new IllegalStateException("Cannot change status: dependent tasks are not completed");
                }
            }
        }
        
        task.setStatus(status);
        Task savedTask = taskRepository.save(task);
        
        // Record status change in history
        recordHistory(task, modifiedBy, "STATUS_CHANGED", 
            oldStatus.toString(), status.toString());
        
        return savedTask;
    }

    @Override
    @Transactional
    public Task updateTaskProgress(Long id, Integer progress, User modifiedBy) {
        Task task = getTaskById(id);
        Integer oldProgress = task.getProgress();
        
        if (progress < 0 || progress > 100) {
            throw new IllegalArgumentException("Progress must be between 0 and 100");
        }
        
        task.setProgress(progress);
        Task savedTask = taskRepository.save(task);
        
        // Record progress change in history
        recordHistory(task, modifiedBy, "PROGRESS_UPDATED", 
            oldProgress.toString(), progress.toString());
        
        return savedTask;
    }

    @Override
    @Transactional
    public void addDependency(Long taskId, Long dependencyId) {
        Task task = getTaskById(taskId);
        Task dependency = getTaskById(dependencyId);
        
        if (task.getId().equals(dependencyId)) {
            throw new IllegalArgumentException("Task cannot depend on itself");
        }
        
        // Check for circular dependencies
        if (hasCircularDependency(task, dependency)) {
            throw new IllegalStateException("Circular dependency detected");
        }
        
        task.addDependency(dependency);
        taskRepository.save(task);
        
        // Record dependency addition in history
        TaskHistory history = new TaskHistory();
        history.setTask(task);
        history.setUser(task.getAssignee());
        history.setAction("DEPENDENCY_ADDED");
        history.setDescription("Added dependency: " + dependency.getTitle());
        taskHistoryRepository.save(history);
    }

    @Override
    @Transactional
    public void removeDependency(Long taskId, Long dependencyId) {
        Task task = getTaskById(taskId);
        Task dependency = getTaskById(dependencyId);
        
        task.removeDependency(dependency);
        taskRepository.save(task);
        
        // Record dependency removal in history
        TaskHistory history = new TaskHistory();
        history.setTask(task);
        history.setUser(task.getAssignee());
        history.setAction("DEPENDENCY_REMOVED");
        history.setDescription("Removed dependency: " + dependency.getTitle());
        taskHistoryRepository.save(history);
    }

    @Override
    @Transactional
    public TaskComment addComment(Long taskId, String content, User user) {
        Task task = getTaskById(taskId);
        
        TaskComment comment = new TaskComment();
        comment.setTask(task);
        comment.setUser(user);
        comment.setContent(content);
        
        TaskComment savedComment = taskCommentRepository.save(comment);
        
        // Record comment addition in history
        TaskHistory history = new TaskHistory();
        history.setTask(task);
        history.setUser(user);
        history.setAction("COMMENT_ADDED");
        history.setDescription("Added comment");
        taskHistoryRepository.save(history);
        
        return savedComment;
    }

    @Override
    public List<TaskHistory> getTaskHistory(Long taskId) {
        Task task = getTaskById(taskId);
        return taskHistoryRepository.findByTaskOrderByCreatedAtDesc(task);
    }

    @Override
    public List<TaskComment> getTaskComments(Long taskId) {
        Task task = getTaskById(taskId);
        return taskCommentRepository.findByTaskOrderByCreatedAtDesc(task);
    }

    private void recordHistory(Task task, User user, String action, String oldValue, String newValue) {
        TaskHistory history = new TaskHistory();
        history.setTask(task);
        history.setUser(user);
        history.setAction(action);
        history.setOldValue(oldValue);
        history.setNewValue(newValue);
        taskHistoryRepository.save(history);
    }

    private boolean hasCircularDependency(Task task, Task dependency) {
        if (task.getDependencies().contains(dependency)) {
            return true;
        }
        for (Task dep : task.getDependencies()) {
            if (hasCircularDependency(dep, dependency)) {
                return true;
            }
        }
        return false;
    }

    @Override
    @Transactional
    public Task updateTaskPriority(Long taskId, TaskPriority priority) {
        Task task = getTaskById(taskId);
        task.setPriority(priority);
        return taskRepository.save(task);
    }

    @Override
    @Transactional
    public Task assignTask(Long taskId, User assignee) {
        Task task = getTaskById(taskId);
        task.setAssignedTo(assignee);
        return taskRepository.save(task);
    }
} 