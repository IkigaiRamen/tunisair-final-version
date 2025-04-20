package com.tunisair.meeting.repository;

import com.tunisair.meeting.models.Decision;
import com.tunisair.meeting.models.Meeting;
import com.tunisair.meeting.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DecisionRepository extends JpaRepository<Decision, Long> {
    List<Decision> findByMeeting(Meeting meeting);
    
    List<Decision> findByProposedBy(User user);
    
    List<Decision> findByIsCompleted(boolean isCompleted);
    
    @Query("SELECT d FROM Decision d WHERE d.meeting = :meeting AND d.isCompleted = false")
    List<Decision> findPendingDecisionsByMeeting(@Param("meeting") Meeting meeting);
    
    List<Decision> findByDecisionDateBetween(LocalDateTime start, LocalDateTime end);
    
    List<Decision> findByMeetingOrderByDecisionDateDesc(Meeting meeting);
} 