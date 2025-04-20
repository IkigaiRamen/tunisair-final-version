package com.tunisair.meeting.service.impl;

import com.tunisair.meeting.models.Decision;
import com.tunisair.meeting.models.Meeting;
import com.tunisair.meeting.models.User;
import com.tunisair.meeting.repository.DecisionRepository;
import com.tunisair.meeting.service.DecisionService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DecisionServiceImpl implements DecisionService {

    private final DecisionRepository decisionRepository;

    @Autowired
    public DecisionServiceImpl(DecisionRepository decisionRepository) {
        this.decisionRepository = decisionRepository;
    }

    @Override
    @Transactional
    public Decision createDecision(Decision decision) {
        decision.setCreatedAt(LocalDateTime.now());
        return decisionRepository.save(decision);
    }

    @Override
    @Transactional
    public Decision updateDecision(Long id, Decision decision) {
        Decision existingDecision = getDecisionById(id);
        
        existingDecision.setDescription(decision.getDescription());
        
        return decisionRepository.save(existingDecision);
    }

    @Override
    @Transactional
    public void deleteDecision(Long id) {
        Decision decision = getDecisionById(id);
        decisionRepository.delete(decision);
    }

    @Override
    public Decision getDecisionById(Long id) {
        return decisionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Decision not found with id: " + id));
    }

    @Override
    public List<Decision> getAllDecisions() {
        return decisionRepository.findAll();
    }

    @Override
    public List<Decision> getDecisionsByMeeting(Meeting meeting) {
        return decisionRepository.findByMeeting(meeting);
    }

    @Override
    public List<Decision> getDecisionsByProposer(User proposer) {
        return decisionRepository.findByProposedBy(proposer);
    }

    @Override
    public List<Decision> getPendingDecisionsByMeeting(Meeting meeting) {
        return decisionRepository.findPendingDecisionsByMeeting(meeting);
    }

    @Override
    @Transactional
    public Decision markAsCompleted(Long decisionId) {
        Decision decision = getDecisionById(decisionId);
        decision.setCompleted(true);
        return decisionRepository.save(decision);
    }
} 