import { User } from './user.model';
import { Meeting } from './meeting.model';
import { Decision } from './decision.model';

export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: Date;
    assignedTo: User;
    createdBy: User;
    meeting: Meeting;
    decision: Decision;
    comments: TaskComment[];
    history: TaskHistory[];
    createdAt: Date;
    updatedAt: Date;
}

export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    REVIEW = 'REVIEW',
    COMPLETED = 'COMPLETED'
}

export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT'
}

export interface TaskComment {
    id: number;
    task: Task;
    content: string;
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
}

export interface TaskHistory {
    id: number;
    task: Task;
    field: string;
    oldValue: string;
    newValue: string;
    changedBy: User;
    changedAt: Date;
} 