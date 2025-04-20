import { User } from '../../user/models/user.model';
import { Meeting } from '../../meeting/models/meeting.model';

export interface Document {
  id: number;
  filename: string;
  originalFilename: string;
  fileType: string;
  fileSize: number;
  uploadDate: Date;
  description: string;
  meeting: Meeting;
  uploadedBy: User;
  currentVersion: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentVersion {
  id: number;
  versionNumber: string;
  filename: string;
  originalFilename: string;
  fileType: string;
  fileSize: number;
  uploadDate: Date;
  description: string;
  uploadedBy: User;
  isCurrentVersion: boolean;
  createdAt: Date;
  updatedAt: Date;
} 