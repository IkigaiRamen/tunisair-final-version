package com.tunisair.meeting.models;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "meeting_minutes")
public class MeetingMinutes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "meeting_id", nullable = false)
    private Meeting meeting;

    @Column(columnDefinition = "TEXT")
    private String content;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "last_modified_by")
    private User lastModifiedBy;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "meetingMinutes", cascade = CascadeType.ALL)
    private List<MeetingAttendance> attendees;

    @Column
    private String status; // DRAFT, FINAL, APPROVED

    @Column
    private boolean isPublic = false;
} 