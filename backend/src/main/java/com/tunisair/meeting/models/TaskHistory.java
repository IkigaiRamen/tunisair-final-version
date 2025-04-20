package com.tunisair.meeting.models;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "task_history")
public class TaskHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String action; // CREATED, UPDATED, STATUS_CHANGED, PROGRESS_UPDATED, etc.

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private String oldValue;

    @Column
    private String newValue;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime createdAt;
} 