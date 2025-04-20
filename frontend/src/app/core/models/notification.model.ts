import { User } from './user.model';

export interface Notification {
    id: number;
    title: string;
    message: string;
    type: NotificationType;
    status: NotificationStatus;
    recipient: User;
    readAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export enum NotificationType {
    MEETING = 'MEETING',
    TASK = 'TASK',
    DECISION = 'DECISION',
    DOCUMENT = 'DOCUMENT',
    SYSTEM = 'SYSTEM'
}

export enum NotificationStatus {
    UNREAD = 'UNREAD',
    READ = 'READ',
    ARCHIVED = 'ARCHIVED'
} 