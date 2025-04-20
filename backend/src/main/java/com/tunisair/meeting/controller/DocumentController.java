package com.tunisair.meeting.controller;

import com.tunisair.meeting.models.Document;
import com.tunisair.meeting.models.DocumentVersion;
import com.tunisair.meeting.models.Meeting;
import com.tunisair.meeting.models.User;
import com.tunisair.meeting.service.DocumentService;
import com.tunisair.meeting.service.MeetingService;
import com.tunisair.meeting.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DocumentController {

    private final DocumentService documentService;
    private final MeetingService meetingService;
    private final UserService userService;

    @Autowired
    public DocumentController(DocumentService documentService, MeetingService meetingService, UserService userService) {
        this.documentService = documentService;
        this.meetingService = meetingService;
        this.userService = userService;
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Document> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam Long meetingId,
            @RequestParam String description) {
        Meeting meeting = meetingService.getMeetingById(meetingId);
        User currentUser = userService.getCurrentUser();
        Document document = documentService.uploadDocument(file, meeting, currentUser, description);
        return ResponseEntity.ok(document);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Document> getDocumentById(@PathVariable Long id) {
        Document document = documentService.getDocumentById(id);
        return ResponseEntity.ok(document);
    }

    @GetMapping("/meeting/{meetingId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Document>> getDocumentsByMeeting(@PathVariable Long meetingId) {
        Meeting meeting = meetingService.getMeetingById(meetingId);
        List<Document> documents = documentService.getDocumentsByMeeting(meeting);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/my-documents")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Document>> getMyDocuments() {
        User currentUser = userService.getCurrentUser();
        List<Document> documents = documentService.getDocumentsByUploader(currentUser);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Document>> searchDocuments(@RequestParam String keyword) {
        List<Document> documents = documentService.searchDocuments(keyword);
        return ResponseEntity.ok(documents);
    }

    @PutMapping("/{id}/version")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Document> updateDocumentVersion(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile newFile,
            @RequestParam String description) {
        Document document = documentService.updateDocumentVersion(id, newFile, description);
        return ResponseEntity.ok(document);
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable Long id) {
        byte[] fileContent = documentService.downloadDocument(id);
        return ResponseEntity.ok(fileContent);
    }

    // Version control endpoints
    @GetMapping("/{id}/versions")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<DocumentVersion>> getDocumentVersions(@PathVariable Long id) {
        List<DocumentVersion> versions = documentService.getDocumentVersions(id);
        return ResponseEntity.ok(versions);
    }

    @GetMapping("/{id}/current-version")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<DocumentVersion> getCurrentVersion(@PathVariable Long id) {
        DocumentVersion version = documentService.getCurrentVersion(id);
        return ResponseEntity.ok(version);
    }

    @GetMapping("/{id}/versions/{versionNumber}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<DocumentVersion> getVersionByNumber(
            @PathVariable Long id,
            @PathVariable String versionNumber) {
        DocumentVersion version = documentService.getVersionByNumber(id, versionNumber);
        return ResponseEntity.ok(version);
    }

    @PostMapping("/{id}/revert/{versionNumber}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<DocumentVersion> revertToVersion(
            @PathVariable Long id,
            @PathVariable String versionNumber) {
        DocumentVersion version = documentService.revertToVersion(id, versionNumber);
        return ResponseEntity.ok(version);
    }

    @DeleteMapping("/{id}/versions/{versionNumber}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteVersion(
            @PathVariable Long id,
            @PathVariable String versionNumber) {
        documentService.deleteVersion(id, versionNumber);
        return ResponseEntity.ok().build();
    }
} 