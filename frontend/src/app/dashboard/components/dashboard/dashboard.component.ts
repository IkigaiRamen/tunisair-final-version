import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TaskService } from '../../../task/services/task.service';
import { MeetingService } from '../../../meeting/services/meeting.service';
import { DocumentService } from '../../../document/services/document.service';
import { Task } from '../../../task/models/task.model';
import { Meeting } from '../../../meeting/models/meeting.model';
import { Document } from '../../../document/models/document.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [MessageService]
})
export class DashboardComponent implements OnInit {
  loading = false;
  tasks: Task[] = [];
  meetings: Meeting[] = [];
  documents: Document[] = [];
  taskStats = {
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0
  };
  meetingStats = {
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0
  };
  documentStats = {
    total: 0,
    recent: 0,
    byType: new Map<string, number>()
  };

  constructor(
    private taskService: TaskService,
    private meetingService: MeetingService,
    private documentService: DocumentService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.loadTasks();
    this.loadMeetings();
    this.loadDocuments();
  }

  private loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.calculateTaskStats();
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load tasks'
        });
        this.loading = false;
      }
    });
  }

  private loadMeetings(): void {
    this.meetingService.getAllMeetings().subscribe({
      next: (meetings) => {
        this.meetings = meetings;
        this.calculateMeetingStats();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load meetings'
        });
      }
    });
  }

  private loadDocuments(): void {
    this.documentService.getAllDocuments().subscribe({
      next: (documents) => {
        this.documents = documents;
        this.calculateDocumentStats();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load documents'
        });
      }
    });
  }

  private calculateTaskStats(): void {
    this.taskStats = {
      total: this.tasks.length,
      completed: this.tasks.filter(t => t.status === 'COMPLETED').length,
      inProgress: this.tasks.filter(t => t.status === 'IN_PROGRESS').length,
      overdue: this.tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'COMPLETED').length
    };
  }

  private calculateMeetingStats(): void {
    const now = new Date();
    this.meetingStats = {
      total: this.meetings.length,
      upcoming: this.meetings.filter(m => new Date(m.startTime) > now).length,
      completed: this.meetings.filter(m => m.status === 'COMPLETED').length,
      cancelled: this.meetings.filter(m => m.status === 'CANCELLED').length
    };
  }

  private calculateDocumentStats(): void {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    this.documentStats = {
      total: this.documents.length,
      recent: this.documents.filter(d => new Date(d.createdAt) > thirtyDaysAgo).length,
      byType: this.documents.reduce((acc, doc) => {
        const type = doc.fileType || 'Unknown';
        acc.set(type, (acc.get(type) || 0) + 1);
        return acc;
      }, new Map<string, number>())
    };
  }
} 