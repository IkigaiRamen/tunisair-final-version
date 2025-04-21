import { User } from '../../user/models/user.model';
import { Meeting } from '../../meeting/models/meeting.model';

export interface Decision {
  id: number;
  title: string;
  description: string;
  status: DecisionStatus;
  proposer: User;
  meeting: Meeting;
  meetingId: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum DecisionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DEFERRED = 'DEFERRED'
} 