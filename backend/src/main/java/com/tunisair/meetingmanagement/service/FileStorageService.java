package com.tunisair.meetingmanagement.service;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface FileStorageService {
    String saveProfilePicture(MultipartFile file, Long userId) throws IOException;
    void deleteProfilePicture(String fileName) throws IOException;
} 