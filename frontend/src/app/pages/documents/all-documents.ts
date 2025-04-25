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
import { MessageService } from 'primeng/api';
import { Document } from '../../core/models/document.model';
import { DocumentsService } from '../../core/services/documents.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-all-documents',
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
        RouterModule
    ],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <div class="col-span-full">
                <div class="card">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold">All Documents</h2>
                        <div class="flex gap-2">
                            <p-button icon="pi pi-plus" label="Upload Document" 
                                      [routerLink]="['/documents/upload']" />
                        </div>
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
                                <th pSortableColumn="meeting">Meeting <p-sortIcon field="meeting" /></th>
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
                                    <a [routerLink]="['/meetings', document.meeting?.id]" 
                                       class="text-primary hover:underline">
                                        {{ document.meeting?.title }}
                                    </a>
                                </td>
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
                    </p-table>
                </div>
            </div>
        </div>
    `,
    providers: [MessageService, DocumentsService]
})
export class AllDocumentsComponent implements OnInit {
    documents: Document[] = [];

    constructor(
        private documentsService: DocumentsService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.loadDocuments();
    }

    loadDocuments() {
        this.documentsService.list().subscribe({
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