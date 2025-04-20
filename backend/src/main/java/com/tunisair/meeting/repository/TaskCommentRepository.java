package com.tunisair.meeting.repository;

import com.tunisair.meeting.models.Task;
import com.tunisair.meeting.models.TaskComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskCommentRepository extends JpaRepository<TaskComment, Long> {
    List<TaskComment> findByTaskOrderByCreatedAtDesc(Task task);
    List<TaskComment> findByTaskAndUserOrderByCreatedAtDesc(Task task, User user);
} 