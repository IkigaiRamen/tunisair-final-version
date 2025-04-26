package com.tunisair.meetingmanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "documents")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String path;

    @Column(nullable = false)
    private Long version;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meeting_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Meeting meeting;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User uploadedBy;
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "size")
    private Long size;
} 