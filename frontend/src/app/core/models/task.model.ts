import { Decision } from './decision.model';
import { User } from './user.model';

export interface Task {
  id: number;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  decision: Decision;
  assignedTo: User;
  deadline: string;
  createdAt?: string;
  updatedAt?: string;
} 