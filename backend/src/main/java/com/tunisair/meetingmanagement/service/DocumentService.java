package com.tunisair.meetingmanagement.service;

import com.tunisair.meetingmanagement.model.Document;
import com.tunisair.meetingmanagement.model.Meeting;
import com.tunisair.meetingmanagement.model.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface DocumentService {
    List<Document> getAllDocuments();
    Optional<Document> getDocumentById(Long id);
    Document uploadDocument(MultipartFile file, Meeting meeting, User uploadedBy);
    Document updateDocument(Long id, Document documentDetails);
    void deleteDocument(Long id);
    List<Document> getDocumentsByMeeting(Meeting meeting);
    List<Document> getDocumentsByUploader(User user);
    Document createNewVersion(Long documentId, MultipartFile file, User uploadedBy);
    byte[] downloadDocument(Long id);
    boolean hasAccess(User user, Document document);
} 