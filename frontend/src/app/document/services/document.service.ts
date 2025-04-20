import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Document, DocumentVersion } from '../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = `${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) { }

  uploadDocument(file: File, meetingId: number, description: string): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('meetingId', meetingId.toString());
    formData.append('description', description);
    return this.http.post<Document>(`${this.apiUrl}/upload`, formData);
  }

  updateDocumentVersion(documentId: number, file: File, description: string): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    return this.http.put<Document>(`${this.apiUrl}/${documentId}/version`, formData);
  }

  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getDocumentById(id: number): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/${id}`);
  }

  getDocumentsByMeeting(meetingId: number): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/meeting/${meetingId}`);
  }

  getDocumentsByUploader(userId: number): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/uploader/${userId}`);
  }

  searchDocuments(keyword: string): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/search`, {
      params: { keyword }
    });
  }

  downloadDocument(documentId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${documentId}/download`, {
      responseType: 'blob'
    });
  }

  getDocumentVersions(documentId: number): Observable<DocumentVersion[]> {
    return this.http.get<DocumentVersion[]>(`${this.apiUrl}/${documentId}/versions`);
  }

  getCurrentVersion(documentId: number): Observable<DocumentVersion> {
    return this.http.get<DocumentVersion>(`${this.apiUrl}/${documentId}/versions/current`);
  }

  getVersionByNumber(documentId: number, versionNumber: string): Observable<DocumentVersion> {
    return this.http.get<DocumentVersion>(`${this.apiUrl}/${documentId}/versions/${versionNumber}`);
  }

  revertToVersion(documentId: number, versionNumber: string): Observable<Document> {
    return this.http.put<Document>(`${this.apiUrl}/${documentId}/versions/${versionNumber}/revert`, {});
  }

  deleteVersion(documentId: number, versionNumber: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${documentId}/versions/${versionNumber}`);
  }
} 