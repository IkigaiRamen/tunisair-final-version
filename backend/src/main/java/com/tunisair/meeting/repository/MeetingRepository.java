package com.tunisair.meeting.repository;

import com.tunisair.meeting.models.Meeting;
import com.tunisair.meeting.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Long> {
    List<Meeting> findByOrganizer(User organizer);
    
    List<Meeting> findByParticipantsContaining(User participant);
    
    List<Meeting> findByDateTimeBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT m FROM Meeting m WHERE m.isCompleted = false AND m.dateTime < :now")
    List<Meeting> findOverdueMeetings(@Param("now") LocalDateTime now);
    
    @Query("SELECT m FROM Meeting m WHERE m.isCompleted = false AND m.dateTime BETWEEN :now AND :nextDay")
    List<Meeting> findUpcomingMeetings(@Param("now") LocalDateTime now, @Param("nextDay") LocalDateTime nextDay);
} 