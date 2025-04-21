package com.tunisair.meetingmanagement.service;

import com.tunisair.meetingmanagement.model.NotificationLog;
import com.tunisair.meetingmanagement.model.User;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationService {
    void sendMeetingInvitation(User user, String meetingTitle, LocalDateTime meetingDateTime);
    void sendMeetingReminder(User user, String meetingTitle, LocalDateTime meetingDateTime);
    void sendTaskAssignment(User user, String taskDescription, LocalDateTime deadline);
    void sendTaskReminder(User user, String taskDescription, LocalDateTime deadline);
    void sendDecisionNotification(User user, String decisionContent, LocalDateTime deadline);
    List<NotificationLog> getNotificationsByUser(User user);
    List<NotificationLog> getNotificationsByDateRange(LocalDateTime start, LocalDateTime end);
    void markNotificationAsRead(Long notificationId);
    void deleteNotification(Long notificationId);
} 