package com.tunisair.meetingmanagement.service;

import com.tunisair.meetingmanagement.model.Decision;
import com.tunisair.meetingmanagement.model.Meeting;
import com.tunisair.meetingmanagement.model.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface DecisionService {
    List<Decision> getAllDecisions();
    Optional<Decision> getDecisionById(Long id);
    Decision createDecision(Decision decision);
    Decision updateDecision(Long id, Decision decisionDetails);
    void deleteDecision(Long id);
    List<Decision> getDecisionsByMeeting(Meeting meeting);
    List<Decision> getDecisionsByResponsibleUser(User user);
    List<Decision> getDecisionsByDeadlineRange(LocalDateTime start, LocalDateTime end);
    List<Decision> getPendingDecisions();
    Decision assignResponsibleUser(Long decisionId, Long userId);
    Decision updateDeadline(Long decisionId, LocalDateTime newDeadline);
} 