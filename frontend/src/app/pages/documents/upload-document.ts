import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule, FileUpload } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Meeting } from '../../core/models/meeting.model';
import { Document } from '../../core/models/document.model';
import { DocumentsService } from '../../core/services/documents.service';
import { MeetingsService } from '../../core/services/meetings.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-upload-document',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        FileUploadModule,
        DropdownModule,
        ToastModule
    ],
    template: `
        <p-toast></p-toast>
        <div class="grid grid-cols-12 gap-8">
            <div class="col-span-full">
                <div class="card">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold">Upload Document</h2>
                    </div>

                    <div class="flex flex-col gap-6">
                        <div class="field">
                            <label for="meeting" class="block font-bold mb-2">Select Meeting</label>
                            <p-dropdown [options]="meetings" [(ngModel)]="selectedMeeting" 
                                      optionLabel="title" placeholder="Select a meeting"
                                      [showClear]="true" styleClass="w-full md:w-20rem" />
                        </div>

                        <div class="field">
                            <label class="block font-bold mb-2">Upload Files</label>
                            <p-fileupload #fileUpload
                                        mode="advanced"
                                        [multiple]="true"
                                        accept="*/*"
                                        maxFileSize="10000000"
                                        [customUpload]="true"
                                        (uploadHandler)="uploadFiles($event)"
                                        (onSelect)="onFileSelect($event)"
                                        (onError)="onUploadError($event)"
                                        (onClear)="onClear()"
                                        chooseLabel="Choose Files"
                                        uploadLabel="Upload"
                                        cancelLabel="Cancel"
                                        [showUploadButton]="true"
                                        [showCancelButton]="true"
                                        [auto]="false">
                                <ng-template pTemplate="empty">
                                    <div class="flex align-items-center justify-content-center p-4">
                                        <i class="pi pi-file mr-2 text-2xl"></i>
                                        <span class="text-lg">Drag and drop files to here to upload.</span>
                                    </div>
                                </ng-template>
                                <ng-template pTemplate="content">
                                    <ul *ngIf="uploadedFiles.length" class="m-0 p-0 list-none">
                                        <li *ngFor="let file of uploadedFiles" class="flex items-center gap-2 p-2">
                                            <i class="pi pi-file text-xl"></i>
                                            <span>{{ file.name }} - {{ file.size  }}</span>
                                        </li>
                                    </ul>
                                </ng-template>
                            </p-fileupload>
                        </div>

                        <div class="flex justify-end gap-2">
                            <p-button label="Cancel" icon="pi pi-times" (onClick)="goBack()" />
                            <p-button label="Upload" icon="pi pi-upload" (onClick)="uploadFiles(fileUpload)" [disabled]="!selectedMeeting || !uploadedFiles.length" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    providers: [MessageService, DocumentsService, MeetingsService]
})
export class UploadDocumentComponent implements OnInit {
    @ViewChild('fileUpload') fileUpload!: FileUpload;
    
    meetings: Meeting[] = [];
    selectedMeeting: Meeting | null = null;
    uploadedFiles: any[] = [];

    constructor(
        private documentsService: DocumentsService,
        private meetingsService: MeetingsService,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit() {
        this.loadMeetings();
    }

    loadMeetings() {
        this.meetingsService.list().subscribe({
            next: (meetings) => {
                this.meetings = meetings;
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

    onFileSelect(event: any) {
        this.uploadedFiles = event.files;
        console.log('Files selected:', this.uploadedFiles);
    }

    onUploadError(event: any) {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error uploading file: ' + event.error
        });
    }

    onClear() {
        this.uploadedFiles = [];
    }

    uploadFiles(event: any) {
        if (!this.selectedMeeting) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please select a meeting first'
            });
            return;
        }

        if (!this.uploadedFiles.length) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please select at least one file to upload'
            });
            return;
        }

        const formData = new FormData();
        for (const file of this.uploadedFiles) {
            formData.append('file', file);
        }
        formData.append('meetingId', this.selectedMeeting.id.toString());

        this.documentsService.upload(formData).subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Documents uploaded successfully'
                });
                this.uploadedFiles = [];
                this.fileUpload.clear();
                this.goBack();
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to upload documents: ' + (error.error?.message || 'Unknown error')
                });
            }
        });
    }

    goBack() {
        this.router.navigate(['/documents']);
    }
} 