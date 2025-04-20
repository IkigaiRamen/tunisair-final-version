package com.tunisair.meeting.repository;

import com.tunisair.meeting.models.MeetingAttendance;
import com.tunisair.meeting.models.MeetingMinutes;
import com.tunisair.meeting.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingAttendanceRepository extends JpaRepository<MeetingAttendance, Long> {
    List<MeetingAttendance> findByMeetingMinutes(MeetingMinutes meetingMinutes);
    List<MeetingAttendance> findByUser(User user);
    MeetingAttendance findByMeetingMinutesAndUser(MeetingMinutes meetingMinutes, User user);
    long countByMeetingMinutesAndAttendedTrue(MeetingMinutes meetingMinutes);
} 