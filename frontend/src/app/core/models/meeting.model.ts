import { User } from './user.model';
import { Document } from './document.model';
import { Decision } from './decision.model';

export interface Meeting {
  id: number;
  title: string;
  agenda?: string;
  objectives?: string;
  dateTime: string;
  createdBy: User;
  participants: User[];
  documents: Document[];
  decisions: Decision[];
  createdAt: string;
  updatedAt: string;
} 