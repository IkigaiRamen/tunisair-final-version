package com.tunisair.meeting.controllers;

import com.tunisair.meeting.models.Document;
import com.tunisair.meeting.models.Meeting;
import com.tunisair.meeting.models.User;
import com.tunisair.meeting.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/documents")
public class DocumentController {
    @Autowired
    private DocumentService documentService;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Document> uploadDocument(@Valid @RequestBody Document document) {
        Document uploadedDocument = documentService.uploadDocument(document);
        return ResponseEntity.ok(uploadedDocument);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Document> getDocument(@PathVariable Long id) {
        return documentService.getDocumentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Document>> getAllDocuments() {
        List<Document> documents = documentService.getAllDocuments();
        return ResponseEntity.ok(documents);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Document> updateDocument(@PathVariable Long id, @Valid @RequestBody Document document) {
        document.setId(id);
        Document updatedDocument = documentService.updateDocument(document);
        return ResponseEntity.ok(updatedDocument);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/meeting/{meetingId}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Document>> getDocumentsByMeeting(@PathVariable Meeting meeting) {
        List<Document> documents = documentService.getDocumentsByMeeting(meeting);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/uploader/{uploaderId}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Document>> getDocumentsByUploader(@PathVariable User uploader) {
        List<Document> documents = documentService.getDocumentsByUploader(uploader);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/meeting/{meetingId}/type/{fileType}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Document>> getDocumentsByMeetingAndType(
            @PathVariable Meeting meeting, @PathVariable String fileType) {
        List<Document> documents = documentService.getDocumentsByMeetingAndType(meeting, fileType);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/meeting/{meetingId}/latest")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Document>> getLatestDocumentsByMeeting(@PathVariable Meeting meeting) {
        List<Document> documents = documentService.getLatestDocumentsByMeeting(meeting);
        return ResponseEntity.ok(documents);
    }
} 