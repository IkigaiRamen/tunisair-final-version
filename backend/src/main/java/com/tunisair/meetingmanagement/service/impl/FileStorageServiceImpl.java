package com.tunisair.meetingmanagement.service.impl;

import com.tunisair.meetingmanagement.service.FileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private final String uploadDir;

    public FileStorageServiceImpl() {
        // Use user's home directory for file storage
        String userHome = System.getProperty("user.home");
        this.uploadDir = Paths.get(userHome, "tunisair", "profile-pictures").toString();
        createUploadDirectoryIfNotExists();
    }

    private void createUploadDirectoryIfNotExists() {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    @Override
    public String saveProfilePicture(MultipartFile file, Long userId) {
        try {
            // Create a unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = userId + "_" + UUID.randomUUID().toString() + extension;

            // Save the file
            Path filePath = Paths.get(uploadDir, filename);
            Files.copy(file.getInputStream(), filePath);

            // Return the relative path that can be used to access the file
            return "/profile-pictures/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    @Override
    public void deleteProfilePicture(String filePath) {
        try {
            if (filePath != null && !filePath.isEmpty()) {
                String filename = filePath.substring(filePath.lastIndexOf("/") + 1);
                Path path = Paths.get(uploadDir, filename);
                Files.deleteIfExists(path);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not delete the file. Error: " + e.getMessage());
        }
    }
}