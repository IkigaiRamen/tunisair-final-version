import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { Document } from '../../core/models/document.model';
import { Meeting } from '../../core/models/meeting.model';
import { DocumentsService } from '../../core/services/documents.service';
import { MeetingsService } from '../../core/services/meetings.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-documents-by-meeting',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        TableModule,
        TagModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        ToastModule,
        DropdownModule,
        RouterModule
    ],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <div class="col-span-full">
                <div class="card">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold">Documents by Meeting</h2>
                        <div class="flex gap-2">
                            <p-button icon="pi pi-plus" label="Upload Document" 
                                      [routerLink]="['/documents/upload']" />
                        </div>
                    </div>

                    <div class="mb-6">
                        <label for="meeting" class="block font-bold mb-2">Select Meeting</label>
                        <p-dropdown [options]="meetings" [(ngModel)]="selectedMeeting" 
                                  optionLabel="title" placeholder="Select a meeting"
                                  [showClear]="true" (onChange)="onMeetingChange()"
                                  styleClass="w-full md:w-20rem" />
                    </div>

                    <p-table [value]="documents" [paginator]="true" [rows]="10" [showCurrentPageReport]="true"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} documents"
                            [rowsPerPageOptions]="[10,25,50]" [globalFilterFields]="['name','type']"
                            styleClass="p-datatable-sm">
                        <ng-template #caption>
                            <div class="flex items-center justify-between">
                                <p-iconfield>
                                    <p-inputicon styleClass="pi pi-search" />
                                    <input pInputText type="text" (input)="onGlobalFilter($event)" 
                                           placeholder="Search documents..." class="p-inputtext-sm" />
                                </p-iconfield>
                            </div>
                        </ng-template>
                        <ng-template #header>
                            <tr>
                                <th pSortableColumn="name">Name <p-sortIcon field="name" /></th>
                                <th pSortableColumn="type">Type <p-sortIcon field="type" /></th>
                                <th pSortableColumn="size">Size <p-sortIcon field="size" /></th>
                                <th pSortableColumn="createdAt">Upload Date <p-sortIcon field="createdAt" /></th>
                                <th pSortableColumn="uploadedBy">Uploaded By <p-sortIcon field="uploadedBy" /></th>
                                <th>Actions</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-document>
                            <tr>
                                <td class="font-medium">{{ document.name }}</td>
                                <td>
                                    <p-tag [value]="document.type" severity="info" />
                                </td>
                                <td>{{ document.size }}</td>
                                <td>{{ document.createdAt | date:'medium' }}</td>
                                <td>{{ document.uploadedBy?.fullName }}</td>
                                <td>
                                    <div class="flex gap-2">
                                        <p-button icon="pi pi-download" class="p-button-sm" [rounded]="true" [outlined]="true" 
                                                  (onClick)="downloadDocument(document)" />
                                        <p-button icon="pi pi-trash" severity="danger" class="p-button-sm" [rounded]="true" [outlined]="true" 
                                                  (onClick)="deleteDocument(document)" />
                                    </div>
                                </td>
                            </tr>
                        </ng-template>
                        <ng-template #empty>
                            <tr>
                                <td colspan="6" class="text-center p-4">
                                    <div class="flex flex-col items-center justify-center gap-2">
                                        <i class="pi pi-folder text-4xl text-surface-400"></i>
                                        <p class="text-surface-600">No documents found for this meeting</p>
                                    </div>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>
        </div>
    `,
    providers: [MessageService, DocumentsService, MeetingsService]
})
export class DocumentsByMeetingComponent implements OnInit {
    meetings: Meeting[] = [];
    selectedMeeting: Meeting | null = null;
    documents: Document[] = [];

    constructor(
        private documentsService: DocumentsService,
        private meetingsService: MeetingsService,
        private messageService: MessageService
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

    onMeetingChange() {
        if (this.selectedMeeting) {
            this.loadDocuments(this.selectedMeeting.id);
        } else {
            this.documents = [];
        }
    }

    loadDocuments(meetingId: number) {
        this.documentsService.list(meetingId).subscribe({
            next: (documents) => {
                this.documents = documents;
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

    onGlobalFilter(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        // Implement filtering logic
    }

    downloadDocument(doc: Document) {
        this.documentsService.download(doc.id).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = doc.name;
                link.click();
                window.URL.revokeObjectURL(url);
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to download document'
                });
            }
        });
    }

    deleteDocument(document: Document) {
        this.documentsService.delete(document.id).subscribe({
            next: () => {
                this.documents = this.documents.filter(d => d.id !== document.id);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Document deleted successfully'
                });
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete document'
                });
            }
        });
    }
} 