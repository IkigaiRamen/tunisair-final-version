import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MeetingService } from '../../services/meeting.service';
import { UserService } from '../../user/services/user.service';
import { Meeting, MeetingStatus } from '../../models/meeting.model';
import { User } from '../../user/models/user.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-meeting-form',
  templateUrl: './meeting-form.component.html',
  styleUrls: ['./meeting-form.component.scss'],
  providers: [MessageService]
})
export class MeetingFormComponent implements OnInit {
  @Input() meeting: Meeting | null = null;
  @Input() isEditMode = false;
  @Output() meetingSaved = new EventEmitter<Meeting>();
  @Output() cancel = new EventEmitter<void>();

  meetingForm: FormGroup;
  users: User[] = [];
  statusOptions = Object.values(MeetingStatus);
  minDate = new Date();
  loading = false;

  constructor(
    private fb: FormBuilder,
    private meetingService: MeetingService,
    private userService: UserService,
    private messageService: MessageService
  ) {
    this.meetingForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      location: ['', Validators.required],
      status: [MeetingStatus.SCHEDULED, Validators.required],
      participants: [[]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    
    if (this.meeting && this.isEditMode) {
      this.meetingForm.patchValue({
        title: this.meeting.title,
        description: this.meeting.description,
        startTime: new Date(this.meeting.startTime),
        endTime: new Date(this.meeting.endTime),
        location: this.meeting.location,
        status: this.meeting.status,
        participants: this.meeting.participants.map(p => p.id)
      });
    }
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users'
        });
        console.error('Error loading users:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.meetingForm.invalid) {
      this.markFormGroupTouched(this.meetingForm);
      return;
    }

    this.loading = true;
    const formValue = this.meetingForm.value;
    
    const meetingData: Partial<Meeting> = {
      title: formValue.title,
      description: formValue.description,
      startTime: formValue.startTime,
      endTime: formValue.endTime,
      location: formValue.location,
      status: formValue.status,
      participants: formValue.participants.map((id: number) => 
        this.users.find(user => user.id === id)
      ).filter(Boolean) as User[]
    };

    if (this.isEditMode && this.meeting) {
      this.meetingService.updateMeeting(this.meeting.id, meetingData).subscribe({
        next: (updatedMeeting) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Meeting updated successfully'
          });
          this.meetingSaved.emit(updatedMeeting);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update meeting'
          });
          console.error('Error updating meeting:', error);
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.meetingService.createMeeting(meetingData).subscribe({
        next: (newMeeting) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Meeting created successfully'
          });
          this.meetingSaved.emit(newMeeting);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create meeting'
          });
          console.error('Error creating meeting:', error);
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
} 