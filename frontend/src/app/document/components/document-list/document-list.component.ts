import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
  providers: [MessageService]
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [];
  loading: boolean = true;
  selectedDocument: Document | null = null;
  displayDeleteDialog: boolean = false;

  constructor(
    private documentService: DocumentService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.loading = true;
    this.documentService.getDocumentsByMeeting(1).subscribe({
      next: (data) => {
        this.documents = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load documents'
        });
        this.loading = false;
      }
    });
  }

  onDelete(document: Document): void {
    this.selectedDocument = document;
    this.displayDeleteDialog = true;
  }

  confirmDelete(): void {
    if (this.selectedDocument) {
      this.documentService.deleteDocument(this.selectedDocument.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Document deleted successfully'
          });
          this.loadDocuments();
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
    this.displayDeleteDialog = false;
    this.selectedDocument = null;
  }

  onDownload(document: Document): void {
    this.documentService.downloadDocument(document.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = document.originalFilename;
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
} 