import { Meeting } from './meeting.model';
import { User } from './user.model';
import { Task } from './task.model';

export interface Decision {
  id: number;
  content: string;
  meeting: Meeting;
  responsibleUser: User;
  deadline: string;
  createdAt?: string;
  updatedAt?: string;
  tasks: Task[];
} 