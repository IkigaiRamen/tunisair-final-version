package com.tunisair.meeting.service.impl;

import com.tunisair.meeting.models.Notification;
import com.tunisair.meeting.models.User;
import com.tunisair.meeting.repository.NotificationRepository;
import com.tunisair.meeting.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final JavaMailSender mailSender;

    @Autowired
    public NotificationServiceImpl(NotificationRepository notificationRepository, JavaMailSender mailSender) {
        this.notificationRepository = notificationRepository;
        this.mailSender = mailSender;
    }

    @Override
    public void sendMeetingNotification(Notification notification) {
        saveAndSendNotification(notification);
    }

    @Override
    public void sendTaskNotification(Notification notification) {
        saveAndSendNotification(notification);
    }

    @Override
    public void sendDecisionNotification(Notification notification) {
        saveAndSendNotification(notification);
    }

    @Override
    public List<Notification> getUserNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @Override
    public void markNotificationAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    private void saveAndSendNotification(Notification notification) {
        // Save notification to database
        notificationRepository.save(notification);

        // Send email notification
        if (notification.getUser().getEmail() != null) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(notification.getUser().getEmail());
            message.setSubject(notification.getTitle());
            message.setText(notification.getMessage());
            mailSender.send(message);
        }
    }
} 