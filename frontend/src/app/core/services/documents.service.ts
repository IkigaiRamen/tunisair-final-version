import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Document } from '../models/document.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DocumentsService {
  private baseUrl = environment.apiUrl;

  constructor(private api: ApiService, private http: HttpClient) {}

  list(meetingId?: number): Observable<Document[]> {
    const params = meetingId !== undefined ? { meetingId } : undefined;
    return this.api.get<Document[]>('/documents', params);
  }

  upload(formData: FormData): Observable<Document> {
    return this.api.post<Document>('/documents', formData);
  }

  download(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/documents/${id}/download`, { responseType: 'blob' });
  }
} 