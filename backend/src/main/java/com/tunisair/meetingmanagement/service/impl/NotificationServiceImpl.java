package com.tunisair.meetingmanagement.service.impl;

import com.tunisair.meetingmanagement.model.NotificationLog;
import com.tunisair.meetingmanagement.model.User;
import com.tunisair.meetingmanagement.repository.NotificationLogRepository;
import com.tunisair.meetingmanagement.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final JavaMailSender mailSender;
    private final NotificationLogRepository notificationLogRepository;

    @Override
    @Transactional
    public void sendMeetingInvitation(User user, String meetingTitle, LocalDateTime meetingDateTime) {
        String subject = "Meeting Invitation";
        String message = String.format("You have been invited to a meeting: %s\nDate & Time: %s",
                meetingTitle, meetingDateTime);

        sendEmail(user.getEmail(), subject, message);
        saveNotificationLog(user, message, NotificationLog.NotificationType.EMAIL);
    }

    @Override
    @Transactional
    public void sendMeetingReminder(User user, String meetingTitle, LocalDateTime meetingDateTime) {
        String subject = "Meeting Reminder";
        String message = String.format("Reminder: You have a meeting: %s\nDate & Time: %s",
                meetingTitle, meetingDateTime);

        sendEmail(user.getEmail(), subject, message);
        saveNotificationLog(user, message, NotificationLog.NotificationType.EMAIL);
    }

    @Override
    @Transactional
    public void sendTaskAssignment(User user, String taskDescription, LocalDateTime deadline) {
        String subject = "New Task Assignment";
        String message = String.format("You have been assigned a new task: %s\nDeadline: %s",
                taskDescription, deadline);

        sendEmail(user.getEmail(), subject, message);
        saveNotificationLog(user, message, NotificationLog.NotificationType.EMAIL);
    }

    @Override
    @Transactional
    public void sendTaskReminder(User user, String taskDescription, LocalDateTime deadline) {
        String subject = "Task Reminder";
        String message = String.format("Reminder: You have a task due: %s\nDeadline: %s",
                taskDescription, deadline);

        sendEmail(user.getEmail(), subject, message);
        saveNotificationLog(user, message, NotificationLog.NotificationType.EMAIL);
    }

    @Override
    @Transactional
    public void sendDecisionNotification(User user, String decisionContent, LocalDateTime deadline) {
        String subject = "New Decision Notification";
        String message = String.format("A new decision has been made: %s\nDeadline for action: %s",
                decisionContent, deadline);

        sendEmail(user.getEmail(), subject, message);
        saveNotificationLog(user, message, NotificationLog.NotificationType.EMAIL);
    }

    @Override
    public List<NotificationLog> getNotificationsByUser(User user) {
        return notificationLogRepository.findByUserOrderBySentAtDesc(user);
    }

    @Override
    public List<NotificationLog> getNotificationsByDateRange(LocalDateTime start, LocalDateTime end) {
        return notificationLogRepository.findBySentAtBetweenOrderBySentAtDesc(start, end);
    }

    @Override
    @Transactional
    public void markNotificationAsRead(Long notificationId) {
        NotificationLog notification = notificationLogRepository.findById(notificationId)
                .orElseThrow(() -> new EntityNotFoundException("Notification not found with id: " + notificationId));
        notification.setRead(true);
        notificationLogRepository.save(notification);
    }

    @Override
    @Transactional
    public void deleteNotification(Long notificationId) {
        notificationLogRepository.deleteById(notificationId);
    }

    private void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

    private void saveNotificationLog(User user, String message, NotificationLog.NotificationType type) {
        NotificationLog log = new NotificationLog();
        log.setUser(user);
        log.setMessage(message);
        log.setType(type);
        log.setSentAt(LocalDateTime.now());
        log.setRead(false);
        notificationLogRepository.save(log);
    }
} 