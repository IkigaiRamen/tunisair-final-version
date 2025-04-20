import { Component, OnInit } from '@angular/core';
import { MeetingService } from '../../services/meeting.service';
import { Meeting, MeetingStatus } from '../../models/meeting.model';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { MeetingFormComponent } from '../meeting-form/meeting-form.component';
import { MeetingDetailsComponent } from '../meeting-details/meeting-details.component';

@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.scss'],
  providers: [MessageService, ConfirmationService, DialogService]
})
export class MeetingListComponent implements OnInit {
  meetings: Meeting[] = [];
  loading = true;
  error = false;
  
  // Filter properties
  statusFilter: MeetingStatus | null = null;
  dateRange: Date[] = [];
  statusOptions = Object.values(MeetingStatus);
  
  // Pagination properties
  first = 0;
  rows = 10;
  totalRecords = 0;

  constructor(
    private meetingService: MeetingService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadMeetings();
  }

  loadMeetings(): void {
    this.loading = true;
    this.error = false;

    this.meetingService.getAllMeetings().subscribe({
      next: (meetings) => {
        this.meetings = meetings;
        this.totalRecords = meetings.length;
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

  applyFilters(): void {
    this.loading = true;
    
    let filteredMeetings = [...this.meetings];
    
    // Apply status filter
    if (this.statusFilter) {
      filteredMeetings = filteredMeetings.filter(meeting => 
        meeting.status === this.statusFilter
      );
    }
    
    // Apply date range filter
    if (this.dateRange && this.dateRange.length === 2) {
      const startDate = this.dateRange[0];
      const endDate = this.dateRange[1];
      
      filteredMeetings = filteredMeetings.filter(meeting => {
        const meetingDate = new Date(meeting.startTime);
        return meetingDate >= startDate && meetingDate <= endDate;
      });
    }
    
    this.meetings = filteredMeetings;
    this.totalRecords = filteredMeetings.length;
    this.loading = false;
  }

  clearFilters(): void {
    this.statusFilter = null;
    this.dateRange = [];
    this.loadMeetings();
  }

  onCreateMeeting(): void {
    const ref = this.dialogService.open(MeetingFormComponent, {
      header: 'Create New Meeting',
      width: '70%',
      data: {
        isEditMode: false
      }
    });

    ref.onClose.subscribe((meeting: Meeting) => {
      if (meeting) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Meeting created successfully'
        });
        this.loadMeetings();
      }
    });
  }

  onViewMeeting(meeting: Meeting): void {
    const ref = this.dialogService.open(MeetingDetailsComponent, {
      header: 'Meeting Details',
      width: '70%',
      data: {
        meetingId: meeting.id
      }
    });

    ref.onClose.subscribe((result: string) => {
      if (result === 'edited') {
        this.loadMeetings();
      }
    });
  }

  onEditMeeting(meeting: Meeting): void {
    const ref = this.dialogService.open(MeetingFormComponent, {
      header: 'Edit Meeting',
      width: '70%',
      data: {
        meeting: meeting,
        isEditMode: true
      }
    });

    ref.onClose.subscribe((updatedMeeting: Meeting) => {
      if (updatedMeeting) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Meeting updated successfully'
        });
        this.loadMeetings();
      }
    });
  }

  onDeleteMeeting(meeting: Meeting): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the meeting "${meeting.title}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.meetingService.deleteMeeting(meeting.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Meeting deleted successfully'
            });
            this.loadMeetings();
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
    });
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