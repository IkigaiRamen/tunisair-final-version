package com.tunisair.meetingmanagement.repository;

import com.tunisair.meetingmanagement.model.Document;
import com.tunisair.meetingmanagement.model.Meeting;
import com.tunisair.meetingmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByMeeting(Meeting meeting);
    List<Document> findByUploadedBy(User user);
    List<Document> findByNameContainingIgnoreCase(String name);
    List<Document> findByMeeting_Id(Long meetingId);
} 