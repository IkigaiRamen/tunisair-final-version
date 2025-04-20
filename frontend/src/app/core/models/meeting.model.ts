import { User } from './user.model';

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
    decisions: Decision[];
    tasks: Task[];
    documents: Document[];
    minutes: MeetingMinutes;
    createdAt: Date;
    updatedAt: Date;
}

export enum MeetingStatus {
    SCHEDULED = 'SCHEDULED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export interface MeetingMinutes {
    id: number;
    meeting: Meeting;
    content: string;
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
}

export interface MeetingAttendance {
    id: number;
    meeting: Meeting;
    user: User;
    status: AttendanceStatus;
    joinedAt?: Date;
    leftAt?: Date;
}

export enum AttendanceStatus {
    PRESENT = 'PRESENT',
    ABSENT = 'ABSENT',
    LATE = 'LATE'
} 