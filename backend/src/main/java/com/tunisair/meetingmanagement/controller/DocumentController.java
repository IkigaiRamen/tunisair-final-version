package com.tunisair.meetingmanagement.controller;

import com.tunisair.meetingmanagement.model.Document;
import com.tunisair.meetingmanagement.model.Meeting;
import com.tunisair.meetingmanagement.model.User;
import com.tunisair.meetingmanagement.service.AuthService;
import com.tunisair.meetingmanagement.service.DocumentService;
import com.tunisair.meetingmanagement.service.MeetingService;
import com.tunisair.meetingmanagement.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Document Management", description = "Document management APIs")
public class DocumentController {

    private final DocumentService documentService;
    private final MeetingService meetingService;
    private final UserService userService;
    private final AuthService authService;

    @Operation(summary = "Get all documents")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved all documents"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY', 'BOARD_MEMBER')")
    public ResponseEntity<List<Document>> getAllDocuments() {
        return ResponseEntity.ok(documentService.getAllDocuments());
    }

    @Operation(summary = "Get document by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved document"),
        @ApiResponse(responseCode = "404", description = "Document not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY', 'BOARD_MEMBER')")
    public ResponseEntity<Document> getDocumentById(@PathVariable Long id) {
        return documentService.getDocumentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Upload new document")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Document uploaded successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY')")
    public ResponseEntity<List<Document>> uploadDocuments(
            @RequestParam("file") MultipartFile[] files,
            @RequestParam("meetingId") Long meetingId) {

        Meeting meeting = meetingService.getMeetingById(meetingId)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));
        User currentUser = authService.getCurrentUser();

        List<Document> uploadedDocs = new ArrayList<>();
        for (MultipartFile file : files) {
            Document doc = documentService.uploadDocument(file, meeting, currentUser);
            uploadedDocs.add(doc);
        }

        return ResponseEntity.ok(uploadedDocs);
    }


    @Operation(summary = "Update document")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Document updated successfully"),
        @ApiResponse(responseCode = "404", description = "Document not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY')")
    public ResponseEntity<Document> updateDocument(
            @PathVariable Long id,
            @RequestBody Document documentDetails) {
        return ResponseEntity.ok(documentService.updateDocument(id, documentDetails));
    }

    @Operation(summary = "Delete document")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Document deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Document not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Get documents by meeting")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved meeting documents"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/meeting/{meetingId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY', 'BOARD_MEMBER')")
    public ResponseEntity<List<Document>> getDocumentsByMeeting(@PathVariable Long meetingId) {
        Meeting meeting = meetingService.getMeetingById(meetingId)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));
        return ResponseEntity.ok(documentService.getDocumentsByMeeting(meeting));
    }

    @Operation(summary = "Create new document version")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "New version created successfully"),
        @ApiResponse(responseCode = "404", description = "Document not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PostMapping(value = "/{id}/versions", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY')")
    public ResponseEntity<Document> createNewVersion(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(documentService.createNewVersion(id, file, currentUser));
    }

    @Operation(summary = "Download document")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Document downloaded successfully"),
        @ApiResponse(responseCode = "404", description = "Document not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/{id}/download")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY', 'BOARD_MEMBER')")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) {
        Document document = documentService.getDocumentById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        User currentUser = authService.getCurrentUser();
        
        if (!documentService.hasAccess(currentUser, document)) {
            return ResponseEntity.status(403).build();
        }

        byte[] data = documentService.downloadDocument(id);
        ByteArrayResource resource = new ByteArrayResource(data);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + document.getName())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength(data.length)
                .body(resource);
    }
} 