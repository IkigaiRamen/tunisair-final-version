import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../../../task/models/task.model';
import { Meeting } from '../../../meeting/models/meeting.model';
import { Document } from '../../../document/models/document.model';

interface TimelineEvent {
  date: Date;
  type: 'task' | 'meeting' | 'document';
  title: string;
  description: string;
  icon: string;
  color: string;
  data: any;
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  @Input() tasks: Task[] = [];
  @Input() meetings: Meeting[] = [];
  @Input() documents: Document[] = [];

  events: TimelineEvent[] = [];

  ngOnInit(): void {
    this.generateTimelineEvents();
  }

  private generateTimelineEvents(): void {
    const events: TimelineEvent[] = [];

    // Add tasks to timeline
    this.tasks.forEach(task => {
      events.push({
        date: new Date(task.createdAt),
        type: 'task',
        title: task.title,
        description: `Task created: ${task.description}`,
        icon: 'pi pi-list',
        color: this.getTaskColor(task.status),
        data: task
      });
    });

    // Add meetings to timeline
    this.meetings.forEach(meeting => {
      events.push({
        date: new Date(meeting.startTime),
        type: 'meeting',
        title: meeting.title,
        description: `Meeting scheduled: ${meeting.description}`,
        icon: 'pi pi-calendar',
        color: this.getMeetingColor(meeting.status),
        data: meeting
      });
    });

    // Add documents to timeline
    this.documents.forEach(document => {
      events.push({
        date: new Date(document.createdAt),
        type: 'document',
        title: document.filename,
        description: `Document uploaded: ${document.description}`,
        icon: 'pi pi-file',
        color: 'var(--primary-color)',
        data: document
      });
    });

    // Sort events by date
    this.events = events.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  private getTaskColor(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'var(--green-500)';
      case 'IN_PROGRESS':
        return 'var(--blue-500)';
      case 'TODO':
        return 'var(--yellow-500)';
      default:
        return 'var(--primary-color)';
    }
  }

  private getMeetingColor(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'var(--green-500)';
      case 'CANCELLED':
        return 'var(--red-500)';
      case 'IN_PROGRESS':
        return 'var(--blue-500)';
      default:
        return 'var(--primary-color)';
    }
  }
} 