import { User } from './user.model';

export interface NotificationLog {
  id: number;
  user: User;
  message: string;
  type: 'EMAIL' | 'SYSTEM';
  sentAt: string;
  read: boolean;
} 