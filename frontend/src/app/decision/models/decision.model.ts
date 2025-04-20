import { Meeting } from '../../meeting/models/meeting.model';
import { User } from '../../user/models/user.model';

export interface Decision {
  id: number;
  title: string;
  description: string;
  status: DecisionStatus;
  meeting: Meeting;
  proposer: User;
  createdAt: Date;
  updatedAt: Date;
}

export enum DecisionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  IMPLEMENTED = 'IMPLEMENTED'
} 