package com.tunisair.meeting.repository;

import com.tunisair.meeting.models.Document;
import com.tunisair.meeting.models.DocumentVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentVersionRepository extends JpaRepository<DocumentVersion, Long> {
    List<DocumentVersion> findByDocumentOrderByUploadedAtDesc(Document document);
    DocumentVersion findByDocumentAndIsCurrentVersionTrue(Document document);
    List<DocumentVersion> findByDocumentAndVersionNumber(Document document, String versionNumber);
} 