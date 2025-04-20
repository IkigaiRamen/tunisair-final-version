import { User } from '../../user/models/user.model';

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