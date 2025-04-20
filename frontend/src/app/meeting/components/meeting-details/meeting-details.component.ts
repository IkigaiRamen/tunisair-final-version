import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MeetingService } from '../../services/meeting.service';
import { Meeting, MeetingStatus } from '../../models/meeting.model';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meeting-details',
  templateUrl: './meeting-details.component.html',
  styleUrls: ['./meeting-details.component.scss'],
  providers: [MessageService]
})
export class MeetingDetailsComponent implements OnInit {
  @Input() meetingId!: number;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Meeting>();

  meeting: Meeting | null = null;
  loading = true;
  error = false;

  constructor(
    private meetingService: MeetingService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMeeting();
  }

  loadMeeting(): void {
    this.loading = true;
    this.error = false;

    this.meetingService.getMeetingById(this.meetingId).subscribe({
      next: (meeting) => {
        this.meeting = meeting;
        this.loading = false;
      },
      error: (error) => {
        this.error = true;
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load meeting details'
        });
        console.error('Error loading meeting:', error);
      }
    });
  }

  onEdit(): void {
    if (this.meeting) {
      this.edit.emit(this.meeting);
    }
  }

  onDelete(): void {
    if (this.meeting) {
      this.meetingService.deleteMeeting(this.meeting.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Meeting deleted successfully'
          });
          this.close.emit();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete meeting'
          });
          console.error('Error deleting meeting:', error);
        }
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }

  getStatusClass(status: MeetingStatus): string {
    switch (status) {
      case MeetingStatus.SCHEDULED:
        return 'p-tag-info';
      case MeetingStatus.IN_PROGRESS:
        return 'p-tag-warning';
      case MeetingStatus.COMPLETED:
        return 'p-tag-success';
      case MeetingStatus.CANCELLED:
        return 'p-tag-danger';
      default:
        return '';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }
} 