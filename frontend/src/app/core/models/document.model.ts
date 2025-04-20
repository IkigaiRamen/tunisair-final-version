import { User } from './user.model';
import { Meeting } from './meeting.model';

export interface Document {
    id: number;
    filename: string;
    originalFilename: string;
    fileType: string;
    fileSize: number;
    version: string;
    description: string;
    meeting: Meeting;
    uploadedBy: User;
    versions: DocumentVersion[];
    createdAt: Date;
    updatedAt: Date;
}

export interface DocumentVersion {
    id: number;
    document: Document;
    versionNumber: string;
    filePath: string;
    uploadedBy: User;
    description: string;
    createdAt: Date;
} 