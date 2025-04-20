package com.tunisair.meeting.repository;

import com.tunisair.meeting.models.Document;
import com.tunisair.meeting.models.Meeting;
import com.tunisair.meeting.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByMeeting(Meeting meeting);
    
    List<Document> findByUploadedBy(User user);
    
    @Query("SELECT d FROM Document d WHERE d.meeting = :meeting ORDER BY d.uploadedAt DESC")
    List<Document> findLatestDocumentsByMeeting(@Param("meeting") Meeting meeting);
    
    @Query("SELECT d FROM Document d WHERE d.fileName LIKE %:keyword% OR d.description LIKE %:keyword%")
    List<Document> searchDocuments(@Param("keyword") String keyword);
} 