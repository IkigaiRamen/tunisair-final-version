import { User } from '../../user/models/user.model';

export interface Meeting {
  id: number;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  status: MeetingStatus;
  organizer: User;
  participants: User[];
  createdAt: Date;
  updatedAt: Date;
}

export enum MeetingStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
} 