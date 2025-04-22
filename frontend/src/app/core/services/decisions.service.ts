import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Decision } from '../models/decision.model';

@Injectable({ providedIn: 'root' })
export class DecisionsService {
  constructor(private api: ApiService) {}

  list(meetingId?: number): Observable<Decision[]> {
    const params = meetingId !== undefined ? { meetingId } : undefined;
    return this.api.get<Decision[]>('/decisions', params);
  }

  create(data: Decision): Observable<Decision> {
    return this.api.post<Decision>('/decisions', data);
  }

  update(id: number, data: Decision): Observable<Decision> {
    return this.api.put<Decision>(`/decisions/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/decisions/${id}`);
  }
} 