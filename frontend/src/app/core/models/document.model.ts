import { Meeting } from './meeting.model';
import { User } from './user.model';

export interface Document {
  id: number;
  name: string;
  type: string;
  path: string;
  version: number;
  meeting: Meeting;
  uploadedBy: User;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  size?: number;
} 