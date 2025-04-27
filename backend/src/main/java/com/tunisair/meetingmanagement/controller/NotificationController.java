package com.tunisair.meetingmanagement.controller;

import com.tunisair.meetingmanagement.model.NotificationLog;
import com.tunisair.meetingmanagement.model.User;
import com.tunisair.meetingmanagement.repository.NotificationLogRepository;
import com.tunisair.meetingmanagement.repository.UserRepository;
import com.tunisair.meetingmanagement.service.NotificationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Notification Management", description = "Notification management APIs")
public class NotificationController {

    private final NotificationService notificationService;
    private final NotificationLogRepository notificationLogRepository;
    private final UserRepository userRepository;

    // 1. List all notifications for the logged-in user
    @GetMapping
    public List<NotificationLog> getUserNotifications(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + principal.getName()));
        return notificationService.getNotificationsByUser(user);
    }

    // 2. Send a new notification (manually) => Admin use (optional)
    @PostMapping
    public NotificationLog sendNotification(@RequestBody NotificationLog notificationLog, Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + principal.getName()));

        notificationLog.setUser(user);
        notificationLog.setSentAt(java.time.LocalDateTime.now());
        notificationLog.setRead(false);

        return notificationLogRepository.save(notificationLog);
    }

    // 3. Mark a notification as read
    @PutMapping("/{id}/read")
    public void markNotificationAsRead(@PathVariable Long id) {
        notificationService.markNotificationAsRead(id);
    }

    // 4. Delete all notifications for the logged-in user
    @DeleteMapping
    public void deleteAllUserNotifications(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + principal.getName()));

        List<NotificationLog> notifications = notificationLogRepository.findByUserOrderBySentAtDesc(user);
        notificationLogRepository.deleteAll(notifications);
    }
}
