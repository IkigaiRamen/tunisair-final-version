import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DocumentService } from '../../services/document.service';
import { MeetingService } from '../../../meeting/services/meeting.service';
import { Meeting } from '../../../meeting/models/meeting.model';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss'],
  providers: [MessageService]
})
export class DocumentUploadComponent implements OnInit {
  uploadForm: FormGroup;
  meetings: Meeting[] = [];
  loading: boolean = false;
  uploadProgress: number = 0;
  selectedFile: File | null = null;
  maxFileSize: number = 10 * 1024 * 1024; // 10MB

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    private meetingService: MeetingService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.uploadForm = this.fb.group({
      meetingId: ['', Validators.required],
      description: ['', Validators.required],
      file: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMeetings();
  }

  loadMeetings(): void {
    this.loading = true;
    this.meetingService.getAllMeetings().subscribe({
      next: (meetings) => {
        this.meetings = meetings;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load meetings'
        });
        this.loading = false;
      }
    });
  }

  onFileSelect(event: any): void {
    const file = event.files[0];
    if (file) {
      if (file.size > this.maxFileSize) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'File size exceeds 10MB limit'
        });
        return;
      }
      this.selectedFile = file;
      this.uploadForm.patchValue({
        file: file
      });
    }
  }

  onSubmit(): void {
    if (this.uploadForm.invalid || !this.selectedFile) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields and select a file'
      });
      return;
    }

    this.loading = true;
    this.uploadProgress = 0;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('meetingId', this.uploadForm.get('meetingId')?.value);
    formData.append('description', this.uploadForm.get('description')?.value);

    this.documentService.uploadDocument(
      this.selectedFile,
      this.uploadForm.get('meetingId')?.value,
      this.uploadForm.get('description')?.value
    ).subscribe({
      next: (document) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Document uploaded successfully'
        });
        this.router.navigate(['/documents']);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to upload document'
        });
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/documents']);
  }
} 