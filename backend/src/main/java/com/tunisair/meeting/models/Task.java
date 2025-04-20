package com.tunisair.meeting.models;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "assignee_id", nullable = false)
    private User assignee;

    @ManyToOne
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @Column(nullable = false)
    private LocalDateTime deadline;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status = TaskStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskPriority priority = TaskPriority.MEDIUM;

    @Column(nullable = false)
    private Integer progress = 0;

    @ManyToOne
    @JoinColumn(name = "decision_id")
    private Decision decision;

    @ManyToOne
    @JoinColumn(name = "meeting_id")
    private Meeting meeting;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @ManyToMany
    @JoinTable(
        name = "task_dependencies",
        joinColumns = @JoinColumn(name = "task_id"),
        inverseJoinColumns = @JoinColumn(name = "dependent_task_id")
    )
    private List<Task> dependencies = new ArrayList<>();

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL)
    private List<TaskHistory> history = new ArrayList<>();

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL)
    private List<TaskComment> comments = new ArrayList<>();

    public void addDependency(Task dependency) {
        if (!dependencies.contains(dependency)) {
            dependencies.add(dependency);
        }
    }

    public void removeDependency(Task dependency) {
        dependencies.remove(dependency);
    }

    public void addHistory(TaskHistory historyEntry) {
        history.add(historyEntry);
        historyEntry.setTask(this);
    }

    public void addComment(TaskComment comment) {
        comments.add(comment);
        comment.setTask(this);
    }
} 