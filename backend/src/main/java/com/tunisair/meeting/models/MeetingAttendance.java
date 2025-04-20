package com.tunisair.meeting.models;

import lombok.Data;
import javax.persistence.*;

@Data
@Entity
@Table(name = "meeting_attendance")
public class MeetingAttendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "meeting_minutes_id", nullable = false)
    private MeetingMinutes meetingMinutes;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private boolean attended;

    @Column
    private String role; // CHAIR, PARTICIPANT, GUEST

    @Column(columnDefinition = "TEXT")
    private String notes;
} 