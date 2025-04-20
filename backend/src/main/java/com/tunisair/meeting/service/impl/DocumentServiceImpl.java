package com.tunisair.meeting.service.impl;

import com.tunisair.meeting.models.Document;
import com.tunisair.meeting.models.DocumentVersion;
import com.tunisair.meeting.models.Meeting;
import com.tunisair.meeting.models.User;
import com.tunisair.meeting.repository.DocumentRepository;
import com.tunisair.meeting.repository.DocumentVersionRepository;
import com.tunisair.meeting.service.DocumentService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final DocumentVersionRepository documentVersionRepository;
    
    @Value("${app.upload.dir}")
    private String uploadDir;

    @Autowired
    public DocumentServiceImpl(DocumentRepository documentRepository, DocumentVersionRepository documentVersionRepository) {
        this.documentRepository = documentRepository;
        this.documentVersionRepository = documentVersionRepository;
    }

    @Override
    @Transactional
    public Document uploadDocument(MultipartFile file, Meeting meeting, User uploadedBy, String description) {
        try {
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
            
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Save file
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath);
            
            // Create document entity
            Document document = new Document();
            document.setFileName(originalFilename);
            document.setFileType(file.getContentType());
            document.setFilePath(filePath.toString());
            document.setFileSize(file.getSize());
            document.setMeeting(meeting);
            document.setUploadedBy(uploadedBy);
            document.setUploadedAt(LocalDateTime.now());
            document.setDescription(description);
            
            return documentRepository.save(document);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void deleteDocument(Long id) {
        Document document = getDocumentById(id);
        try {
            // Delete file from storage
            Files.deleteIfExists(Paths.get(document.getFilePath()));
            // Delete document record
            documentRepository.delete(document);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file: " + e.getMessage());
        }
    }

    @Override
    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Document not found with id: " + id));
    }

    @Override
    public List<Document> getDocumentsByMeeting(Meeting meeting) {
        return documentRepository.findByMeeting(meeting);
    }

    @Override
    public List<Document> getDocumentsByUploader(User uploader) {
        return documentRepository.findByUploadedBy(uploader);
    }

    @Override
    public List<Document> searchDocuments(String keyword) {
        return documentRepository.searchDocuments(keyword);
    }

    @Override
    @Transactional
    public Document updateDocumentVersion(Long documentId, MultipartFile newFile, String description) {
        Document existingDocument = getDocumentById(documentId);
        
        try {
            // Delete old file
            Files.deleteIfExists(Paths.get(existingDocument.getFilePath()));
            
            // Generate new filename
            String originalFilename = newFile.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
            
            // Save new file
            Path filePath = Paths.get(uploadDir).resolve(uniqueFilename);
            Files.copy(newFile.getInputStream(), filePath);
            
            // Update document
            existingDocument.setFileName(originalFilename);
            existingDocument.setFileType(newFile.getContentType());
            existingDocument.setFilePath(filePath.toString());
            existingDocument.setFileSize(newFile.getSize());
            existingDocument.setDescription(description);
            
            // Increment version
            String currentVersion = existingDocument.getVersion();
            String[] versionParts = currentVersion.split("\\.");
            int majorVersion = Integer.parseInt(versionParts[0]);
            int minorVersion = Integer.parseInt(versionParts[1]);
            existingDocument.setVersion((majorVersion + 1) + ".0");
            
            return documentRepository.save(existingDocument);
        } catch (IOException e) {
            throw new RuntimeException("Failed to update document: " + e.getMessage());
        }
    }

    @Override
    public byte[] downloadDocument(Long documentId) {
        Document document = getDocumentById(documentId);
        try {
            return Files.readAllBytes(Paths.get(document.getFilePath()));
        } catch (IOException e) {
            throw new RuntimeException("Failed to download file: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentVersion> getDocumentVersions(Long documentId) {
        Document document = getDocumentById(documentId);
        return documentVersionRepository.findByDocumentOrderByUploadedAtDesc(document);
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentVersion getCurrentVersion(Long documentId) {
        Document document = getDocumentById(documentId);
        return documentVersionRepository.findByDocumentAndIsCurrentVersionTrue(document)
                .orElseThrow(() -> new RuntimeException("Current version not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentVersion getVersionByNumber(Long documentId, String versionNumber) {
        Document document = getDocumentById(documentId);
        return documentVersionRepository.findByDocumentAndVersionNumber(document, versionNumber)
                .orElseThrow(() -> new RuntimeException("Version not found"));
    }

    @Override
    @Transactional
    public DocumentVersion revertToVersion(Long documentId, String versionNumber) {
        Document document = getDocumentById(documentId);
        DocumentVersion targetVersion = getVersionByNumber(documentId, versionNumber);
        
        // Create a new version with the target version's content
        DocumentVersion newVersion = new DocumentVersion();
        newVersion.setDocument(document);
        newVersion.setVersionNumber(generateNextVersionNumber(document));
        newVersion.setUploadedBy(targetVersion.getUploadedBy());
        newVersion.setUploadedAt(targetVersion.getUploadedAt());
        newVersion.setDescription("Reverted to version " + versionNumber);
        newVersion.setIsCurrentVersion(true);
        
        // Update the current version flag for all versions
        document.getVersions().forEach(version -> version.setIsCurrentVersion(false));
        
        return documentVersionRepository.save(newVersion);
    }

    @Override
    @Transactional
    public void deleteVersion(Long documentId, String versionNumber) {
        Document document = getDocumentById(documentId);
        DocumentVersion version = getVersionByNumber(documentId, versionNumber);
        
        if (version.getIsCurrentVersion()) {
            throw new RuntimeException("Cannot delete the current version");
        }
        
        documentVersionRepository.delete(version);
    }

    private String generateNextVersionNumber(Document document) {
        List<DocumentVersion> versions = documentVersionRepository.findByDocumentOrderByUploadedAtDesc(document);
        if (versions.isEmpty()) {
            return "1.0";
        }
        
        String lastVersion = versions.get(0).getVersionNumber();
        String[] parts = lastVersion.split("\\.");
        int major = Integer.parseInt(parts[0]);
        int minor = Integer.parseInt(parts[1]);
        
        return (major + 1) + ".0";
    }
} 