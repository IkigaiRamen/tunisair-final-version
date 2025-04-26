package com.tunisair.meetingmanagement.service.impl;

import com.tunisair.meetingmanagement.model.Document;
import com.tunisair.meetingmanagement.model.Meeting;
import com.tunisair.meetingmanagement.model.User;
import com.tunisair.meetingmanagement.repository.DocumentRepository;
import com.tunisair.meetingmanagement.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final Path fileStorageLocation = Paths.get("uploads");

    @Override
    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    @Override
    public Optional<Document> getDocumentById(Long id) {
        return documentRepository.findById(id);
    }

    @Override
    @Transactional
    public Document uploadDocument(MultipartFile file, Meeting meeting, User uploadedBy) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Uploaded file is empty or null");
        }

        try {
            Files.createDirectories(fileStorageLocation); // ✅ Ensure directory exists

            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path targetLocation = fileStorageLocation.resolve(fileName);

            // 🐞 Debug logs
            System.out.println("Uploading file: " + file.getOriginalFilename());
            System.out.println("Resolved path: " + targetLocation);
            System.out.println("File storage location: " + fileStorageLocation.toAbsolutePath());

            Files.copy(file.getInputStream(), targetLocation); // 🧱 File copy

            Document document = new Document();
            document.setName(file.getOriginalFilename());
            document.setType(file.getContentType());
            document.setPath(targetLocation.toString());
            document.setVersion(1L);
            document.setMeeting(meeting);
            document.setUploadedBy(uploadedBy);
            document.setCreatedAt(LocalDateTime.now());
            document.setSize(file.getSize());

            return documentRepository.save(document);
        } catch (IOException ex) {
            ex.printStackTrace(); // 🐞 Print detailed stack trace
            throw new RuntimeException("Could not store file. Please try again!", ex);
        }
    }
    @Override
    @Transactional
    public Document updateDocument(Long id, Document documentDetails) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));

        document.setName(documentDetails.getName());
        document.setType(documentDetails.getType());
        // Note: Path and version should not be updated here

        return documentRepository.save(document);
    }

    @Override
    @Transactional
    public void deleteDocument(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));
        
        try {
            Files.deleteIfExists(Paths.get(document.getPath()));
            documentRepository.delete(document);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file", ex);
        }
    }

    @Override
    public List<Document> getDocumentsByMeeting(Meeting meeting) {
        return documentRepository.findByMeeting(meeting);
    }

    @Override
    public List<Document> getDocumentsByUploader(User user) {
        return documentRepository.findByUploadedBy(user);
    }

    @Override
    @Transactional
    public Document createNewVersion(Long documentId, MultipartFile file, User uploadedBy) {
        Document existingDocument = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + documentId));

        try {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path targetLocation = fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation);

            // Delete old file
            Files.deleteIfExists(Paths.get(existingDocument.getPath()));

            existingDocument.setPath(targetLocation.toString());
            existingDocument.setVersion(existingDocument.getVersion() + 1);
            existingDocument.setUpdatedAt(LocalDateTime.now());

            return documentRepository.save(existingDocument);
        } catch (IOException ex) {
            throw new RuntimeException("Could not store new version of file", ex);
        }
    }

    @Override
    public byte[] downloadDocument(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));

        try {
            Path filePath = Paths.get(document.getPath());
            return Files.readAllBytes(filePath);
        } catch (IOException ex) {
            throw new RuntimeException("Could not read file", ex);
        }
    }

    @Override
    public boolean hasAccess(User user, Document document) {
        // Implement access control logic based on user roles and meeting participation
        return user.getRoles().stream().anyMatch(role -> role.getName().equals("ROLE_ADMIN")) ||
               document.getMeeting().getParticipants().contains(user) ||
               document.getUploadedBy().equals(user);
    }
} 