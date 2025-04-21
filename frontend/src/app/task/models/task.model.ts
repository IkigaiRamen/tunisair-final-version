import { User } from '../../user/models/user.model';
import { Decision } from '../../decision/models/decision.model';
import { Meeting } from '../../meeting/models/meeting.model';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  assignee: User;
  createdBy: User;
  decision?: Decision;
  meeting?: Meeting;
  progress?: number;
  dependencies?: Task[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface TaskHistory {
  id: number;
  task: Task;
  user: User;
  action: string;
  description: string;
  timestamp: Date;
}

export interface TaskComment {
  id: number;
  task: Task;
  user: User;
  content: string;
  createdAt: Date;
} 