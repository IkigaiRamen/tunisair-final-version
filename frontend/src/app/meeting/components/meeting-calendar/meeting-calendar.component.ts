import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MeetingService } from '../../services/meeting.service';
import { Meeting, MeetingStatus } from '../../models/meeting.model';
import { MessageService } from 'primeng/api';

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  color: string;
  textColor: string;
}

@Component({
  selector: 'app-meeting-calendar',
  templateUrl: './meeting-calendar.component.html',
  styleUrls: ['./meeting-calendar.component.scss'],
  providers: [MessageService]
})
export class MeetingCalendarComponent implements OnInit {
  @Output() meetingSelected = new EventEmitter<number>();

  events: CalendarEvent[] = [];
  loading = true;
  error = false;

  constructor(
    private meetingService: MeetingService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadMeetings();
  }

  loadMeetings(): void {
    this.loading = true;
    this.error = false;

    this.meetingService.getAllMeetings().subscribe({
      next: (meetings) => {
        this.events = this.convertMeetingsToEvents(meetings);
        this.loading = false;
      },
      error: (error) => {
        this.error = true;
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load meetings'
        });
        console.error('Error loading meetings:', error);
      }
    });
  }

  convertMeetingsToEvents(meetings: Meeting[]): CalendarEvent[] {
    return meetings.map(meeting => ({
      id: meeting.id,
      title: meeting.title,
      start: new Date(meeting.startTime),
      end: new Date(meeting.endTime),
      color: this.getStatusColor(meeting.status),
      textColor: '#ffffff'
    }));
  }

  getStatusColor(status: MeetingStatus): string {
    switch (status) {
      case MeetingStatus.SCHEDULED:
        return '#2196F3'; // Blue
      case MeetingStatus.IN_PROGRESS:
        return '#FFC107'; // Yellow
      case MeetingStatus.COMPLETED:
        return '#4CAF50'; // Green
      case MeetingStatus.CANCELLED:
        return '#F44336'; // Red
      default:
        return '#9E9E9E'; // Gray
    }
  }

  onEventClick(event: any): void {
    this.meetingSelected.emit(event.id);
  }

  onDateSelect(date: Date): void {
    // This could be used to create a new meeting on the selected date
    console.log('Date selected:', date);
  }

  refreshCalendar(): void {
    this.loadMeetings();
  }
} 