package com.tunisair.meeting.service;

import com.tunisair.meeting.models.Meeting;
import com.tunisair.meeting.models.Task;
import com.tunisair.meeting.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private MeetingService meetingService;

    @Autowired
    private TaskService taskService;

    @Scheduled(cron = "0 0 9 * * ?") // Run at 9 AM every day
    public void sendDailyReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime tomorrow = now.plusDays(1);
        
        // Send meeting reminders
        List<Meeting> upcomingMeetings = meetingService.getMeetingsInTimeRange(now, tomorrow);
        for (Meeting meeting : upcomingMeetings) {
            sendMeetingReminder(meeting);
        }

        // Send task reminders
        List<Task> upcomingTasks = taskService.getTasksByStatus(TaskStatus.PENDING);
        for (Task task : upcomingTasks) {
            if (task.getDueDate() != null && task.getDueDate().isBefore(tomorrow)) {
                sendTaskReminder(task);
            }
        }
    }

    private void sendMeetingReminder(Meeting meeting) {
        for (User participant : meeting.getParticipants()) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(participant.getEmail());
            message.setSubject("Upcoming Meeting Reminder: " + meeting.getTitle());
            message.setText(String.format(
                "Dear %s,\n\n" +
                "This is a reminder that you have a meeting scheduled:\n\n" +
                "Title: %s\n" +
                "Date: %s\n" +
                "Location: %s\n\n" +
                "Please make sure to attend.\n\n" +
                "Best regards,\n" +
                "Tunisair Meeting System",
                participant.getUsername(),
                meeting.getTitle(),
                meeting.getDateTime(),
                meeting.getLocation()
            ));
            mailSender.send(message);
        }
    }

    private void sendTaskReminder(Task task) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(task.getAssignedTo().getEmail());
        message.setSubject("Task Reminder: " + task.getTitle());
        message.setText(String.format(
            "Dear %s,\n\n" +
            "This is a reminder about your pending task:\n\n" +
            "Title: %s\n" +
            "Due Date: %s\n" +
            "Priority: %s\n\n" +
            "Please complete this task as soon as possible.\n\n" +
            "Best regards,\n" +
            "Tunisair Meeting System",
            task.getAssignedTo().getUsername(),
            task.getTitle(),
            task.getDueDate(),
            task.getPriority()
        ));
        mailSender.send(message);
    }

    public void sendMeetingInvitation(Meeting meeting, User user) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Meeting Invitation: " + meeting.getTitle());
        message.setText(String.format(
            "Dear %s,\n\n" +
            "You have been invited to a meeting:\n\n" +
            "Title: %s\n" +
            "Date: %s\n" +
            "Location: %s\n" +
            "Organizer: %s\n\n" +
            "Please confirm your attendance.\n\n" +
            "Best regards,\n" +
            "Tunisair Meeting System",
            user.getUsername(),
            meeting.getTitle(),
            meeting.getDateTime(),
            meeting.getLocation(),
            meeting.getOrganizer().getUsername()
        ));
        mailSender.send(message);
    }

    public void sendTaskAssignment(Task task) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(task.getAssignedTo().getEmail());
        message.setSubject("New Task Assignment: " + task.getTitle());
        message.setText(String.format(
            "Dear %s,\n\n" +
            "You have been assigned a new task:\n\n" +
            "Title: %s\n" +
            "Description: %s\n" +
            "Due Date: %s\n" +
            "Priority: %s\n\n" +
            "Please review and start working on this task.\n\n" +
            "Best regards,\n" +
            "Tunisair Meeting System",
            task.getAssignedTo().getUsername(),
            task.getTitle(),
            task.getDescription(),
            task.getDueDate(),
            task.getPriority()
        ));
        mailSender.send(message);
    }
} 