import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { Document } from '../models/document.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DocumentsService {
  private baseUrl = environment.apiUrl;

  constructor(private api: ApiService, private http: HttpClient) {}

  list(meetingId?: number): Observable<Document[]> {
    if (meetingId !== undefined) {
      return this.api.get<Document[]>(`/documents/meeting/${meetingId}`);
    }
    return this.api.get<Document[]>('/documents');
  }

  getById(id: number): Observable<Document> {
    return this.api.get<Document>(`/documents/${id}`);
  }

  upload(formData: FormData): Observable<Document> {
    return this.http.post<Document>(`${this.baseUrl}/documents`, formData);
  }

  update(id: number, documentDetails: Document): Observable<Document> {
    return this.api.put<Document>(`/documents/${id}`, documentDetails);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/documents/${id}`);
  }

  createNewVersion(id: number, file: File): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Document>(`${this.baseUrl}/documents/${id}/versions`, formData);
  }

  download(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/documents/${id}/download`, {
      responseType: 'blob'
    });
  }
}
