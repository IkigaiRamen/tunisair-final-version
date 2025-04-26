package com.tunisair.meetingmanagement.service.impl;

import com.tunisair.meetingmanagement.model.Decision;
import com.tunisair.meetingmanagement.model.Meeting;
import com.tunisair.meetingmanagement.model.User;
import com.tunisair.meetingmanagement.repository.DecisionRepository;
import com.tunisair.meetingmanagement.repository.UserRepository;
import com.tunisair.meetingmanagement.service.DecisionService;
import com.tunisair.meetingmanagement.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DecisionServiceImpl implements DecisionService {

    private final DecisionRepository decisionRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    public List<Decision> getAllDecisions() {
        return decisionRepository.findAll();
    }

    @Override
    public Optional<Decision> getDecisionById(Long id) {
        return decisionRepository.findById(id);
    }

    @Override
    @Transactional
    public Decision createDecision(Decision decision) {
        decision.setCreatedAt(LocalDateTime.now());
        Decision saved = decisionRepository.save(decision);

        Hibernate.initialize(saved.getMeeting());
        Hibernate.initialize(saved.getResponsibleUser());

        if (saved.getResponsibleUser() != null) {
            notificationService.sendTaskAssignment(
                    saved.getResponsibleUser(),
                    "New Decision Assigned",
                    String.format("A new decision \"%s\" has been assigned to you.", saved.getContent()),
                    saved.getDeadline()
            );
        }

        return saved;
    }

    @Override
    @Transactional
    public Decision updateDecision(Long id, Decision decisionDetails) {
        Decision decision = decisionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Decision not found with id: " + id));

        decision.setContent(decisionDetails.getContent());
        decision.setDeadline(decisionDetails.getDeadline());
        decision.setResponsibleUser(decisionDetails.getResponsibleUser());
        decision.setUpdatedAt(LocalDateTime.now());

        Decision updatedDecision = decisionRepository.save(decision);

        if (updatedDecision.getResponsibleUser() != null) {
            notificationService.sendTaskAssignment(
                    updatedDecision.getResponsibleUser(),
                    "Decision Updated",
                    String.format("Your decision \"%s\" has been updated.", updatedDecision.getContent()),
                    updatedDecision.getDeadline()
            );
        }

        return updatedDecision;
    }

    @Override
    @Transactional
    public void deleteDecision(Long id) {
        Decision decision = decisionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Decision not found with id: " + id));

        if (decision.getResponsibleUser() != null) {
            notificationService.sendTaskAssignment(
                    decision.getResponsibleUser(),
                    "Decision Deleted",
                    String.format("The decision \"%s\" assigned to you has been deleted.", decision.getContent()),
                    LocalDateTime.now()
            );
        }

        decisionRepository.delete(decision);
    }

    @Override
    @Transactional
    @EntityGraph(attributePaths = "tasks")
    public List<Decision> getDecisionsByMeeting(Meeting meeting) {
        return decisionRepository.findByMeeting(meeting);
    }

    @Override
    public List<Decision> getDecisionsByResponsibleUser(User user) {
        return decisionRepository.findByResponsibleUser(user);
    }

    @Override
    public List<Decision> getDecisionsByDeadlineRange(LocalDateTime start, LocalDateTime end) {
        return decisionRepository.findByDeadlineBetween(start, end);
    }

    @Override
    public List<Decision> getPendingDecisions() {
        return decisionRepository.findByDeadlineAfter(LocalDateTime.now());
    }

    @Override
    @Transactional
    public Decision assignResponsibleUser(Long decisionId, Long userId) {
        Decision decision = decisionRepository.findById(decisionId)
                .orElseThrow(() -> new RuntimeException("Decision not found with id: " + decisionId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        decision.setResponsibleUser(user);
        decision.setUpdatedAt(LocalDateTime.now());

        Decision updatedDecision = decisionRepository.save(decision);

        notificationService.sendTaskAssignment(
                user,
                "New Decision Responsibility",
                String.format("You have been assigned to a new decision: \"%s\".", updatedDecision.getContent()),
                updatedDecision.getDeadline()
        );

        return updatedDecision;
    }

    @Override
    @Transactional
    public Decision updateDeadline(Long decisionId, LocalDateTime newDeadline) {
        Decision decision = decisionRepository.findById(decisionId)
                .orElseThrow(() -> new RuntimeException("Decision not found with id: " + decisionId));

        decision.setDeadline(newDeadline);
        decision.setUpdatedAt(LocalDateTime.now());

        Decision updatedDecision = decisionRepository.save(decision);

        if (updatedDecision.getResponsibleUser() != null) {
            notificationService.sendTaskAssignment(
                    updatedDecision.getResponsibleUser(),
                    "Decision Deadline Updated",
                    String.format("The deadline for your decision \"%s\" has been updated to %s.", updatedDecision.getContent(), newDeadline),
                    newDeadline
            );
        }

        return updatedDecision;
    }
}
