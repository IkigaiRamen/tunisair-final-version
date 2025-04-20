package com.tunisair.meeting.repository;

import com.tunisair.meeting.models.Task;
import com.tunisair.meeting.models.TaskPriority;
import com.tunisair.meeting.models.TaskStatus;
import com.tunisair.meeting.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedTo(User user);
    
    List<Task> findByStatus(TaskStatus status);
    
    List<Task> findByPriority(TaskPriority priority);
    
    List<Task> findByDueDateBeforeAndStatusNot(LocalDateTime date, TaskStatus status);
    
    @Query("SELECT t FROM Task t WHERE t.assignedTo = :user AND t.status = :status")
    List<Task> findTasksByUserAndStatus(@Param("user") User user, @Param("status") TaskStatus status);
    
    @Query("SELECT t FROM Task t WHERE t.assignedTo = :user AND t.dueDate BETWEEN :start AND :end")
    List<Task> findTasksByUserAndDateRange(@Param("user") User user, 
                                          @Param("start") LocalDateTime start, 
                                          @Param("end") LocalDateTime end);
} 