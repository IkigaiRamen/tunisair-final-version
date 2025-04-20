import { User } from './user.model';
import { Meeting } from './meeting.model';
import { Task } from './task.model';

export interface Decision {
    id: number;
    title: string;
    description: string;
    status: DecisionStatus;
    meeting: Meeting;
    proposer: User;
    tasks: Task[];
    createdAt: Date;
    updatedAt: Date;
}

export enum DecisionStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    IMPLEMENTED = 'IMPLEMENTED'
} 