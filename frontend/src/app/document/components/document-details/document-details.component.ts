import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DocumentService } from '../../services/document.service';
import { Document, DocumentVersion } from '../../models/document.model';

@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.scss'],
  providers: [MessageService]
})
export class DocumentDetailsComponent implements OnInit {
  document: Document | null = null;
  versions: DocumentVersion[] = [];
  loading: boolean = true;
  displayDeleteDialog: boolean = false;
  displayVersionDialog: boolean = false;
  selectedVersion: DocumentVersion | null = null;
  newVersionFile: File | null = null;
  newVersionDescription: string = '';
  maxFileSize: number = 10 * 1024 * 1024; // 10MB

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    const documentId = this.route.snapshot.paramMap.get('id');
    if (documentId) {
      this.loadDocument(parseInt(documentId));
      this.loadVersions(parseInt(documentId));
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Document ID not provided'
      });
      this.router.navigate(['/documents']);
    }
  }

  loadDocument(id: number): void {
    this.loading = true;
    this.documentService.getDocumentById(id).subscribe({
      next: (document) => {
        this.document = document;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load document details'
        });
        this.loading = false;
      }
    });
  }

  loadVersions(documentId: number): void {
    this.documentService.getDocumentVersions(documentId).subscribe({
      next: (versions) => {
        this.versions = versions;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load document versions'
        });
      }
    });
  }

  onDownload(): void {
    if (this.document) {
      this.documentService.downloadDocument(this.document.id).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = this.document?.originalFilename || 'document';
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

  onDelete(): void {
    this.displayDeleteDialog = true;
  }

  confirmDelete(): void {
    if (this.document) {
      this.documentService.deleteDocument(this.document.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Document deleted successfully'
          });
          this.router.navigate(['/documents']);
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
  }

  onNewVersion(): void {
    this.displayVersionDialog = true;
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
      this.newVersionFile = file;
    }
  }

  uploadNewVersion(): void {
    if (!this.document || !this.newVersionFile || !this.newVersionDescription) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields and select a file'
      });
      return;
    }

    this.loading = true;
    this.documentService.updateDocumentVersion(
      this.document.id,
      this.newVersionFile,
      this.newVersionDescription
    ).subscribe({
      next: (document) => {
        this.document = document;
        this.loadVersions(document.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'New version uploaded successfully'
        });
        this.displayVersionDialog = false;
        this.newVersionFile = null;
        this.newVersionDescription = '';
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to upload new version'
        });
        this.loading = false;
      }
    });
  }

  onRevertVersion(version: DocumentVersion): void {
    if (this.document) {
      this.loading = true;
      this.documentService.revertToVersion(this.document.id, version.versionNumber).subscribe({
        next: (document) => {
          this.document = document;
          this.loadVersions(document.id);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Document reverted to version ' + version.versionNumber
          });
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to revert to version ' + version.versionNumber
          });
          this.loading = false;
        }
      });
    }
  }

  onBack(): void {
    this.router.navigate(['/documents']);
  }
} 