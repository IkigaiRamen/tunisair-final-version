package com.tunisair.meetingmanagement.repository;

import com.tunisair.meetingmanagement.model.NotificationLog;
import com.tunisair.meetingmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationLogRepository extends JpaRepository<NotificationLog, Long> {
    List<NotificationLog> findByUserOrderBySentAtDesc(User user);
    List<NotificationLog> findBySentAtBetweenOrderBySentAtDesc(LocalDateTime start, LocalDateTime end);
} 