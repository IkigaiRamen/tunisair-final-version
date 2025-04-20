package com.tunisair.meeting.repository;

import com.tunisair.meeting.models.Task;
import com.tunisair.meeting.models.TaskHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskHistoryRepository extends JpaRepository<TaskHistory, Long> {
    List<TaskHistory> findByTaskOrderByCreatedAtDesc(Task task);
    List<TaskHistory> findByTaskAndActionOrderByCreatedAtDesc(Task task, String action);
} 