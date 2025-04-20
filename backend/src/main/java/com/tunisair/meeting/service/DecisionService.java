package com.tunisair.meeting.service;

import com.tunisair.meeting.models.Decision;
import com.tunisair.meeting.models.Meeting;
import com.tunisair.meeting.models.User;
import com.tunisair.meeting.repository.DecisionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DecisionService {
    @Autowired
    private DecisionRepository decisionRepository;

    @Transactional
    public Decision createDecision(Decision decision) {
        return decisionRepository.save(decision);
    }

    @Transactional(readOnly = true)
    public Optional<Decision> getDecisionById(Long id) {
        return decisionRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Decision> getAllDecisions() {
        return decisionRepository.findAll();
    }

    @Transactional
    public Decision updateDecision(Decision decision) {
        return decisionRepository.save(decision);
    }

    @Transactional
    public void deleteDecision(Long id) {
        decisionRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Decision> getDecisionsByMeeting(Meeting meeting) {
        return decisionRepository.findByMeeting(meeting);
    }

    @Transactional(readOnly = true)
    public List<Decision> getDecisionsByProposer(User proposedBy) {
        return decisionRepository.findByProposedBy(proposedBy);
    }

    @Transactional(readOnly = true)
    public List<Decision> getDecisionsInTimeRange(LocalDateTime start, LocalDateTime end) {
        return decisionRepository.findByDecisionDateBetween(start, end);
    }

    @Transactional(readOnly = true)
    public List<Decision> getLatestDecisionsByMeeting(Meeting meeting) {
        return decisionRepository.findByMeetingOrderByDecisionDateDesc(meeting);
    }

    @Transactional(readOnly = true)
    public List<Decision> getPendingDecisionsByMeeting(Meeting meeting) {
        // Implementation needed
        throw new UnsupportedOperationException("Method not implemented");
    }

    @Transactional
    public Decision markAsCompleted(Long decisionId) {
        // Implementation needed
        throw new UnsupportedOperationException("Method not implemented");
    }
} 