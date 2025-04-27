import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Decision } from '../models/decision.model';

@Injectable({ providedIn: 'root' })
export class DecisionsService {
  constructor(private api: ApiService) {}

  list(meetingId?: number): Observable<Decision[]> {
    console.log('Fetching decisions for meetingId:', meetingId);
    if (meetingId) {
      return this.api.get<Decision[]>(`/decisions/meeting/${meetingId}`).pipe(
        tap({
          next: (decisions) => console.log('Received decisions:', decisions),
          error: (error) => console.error('Error fetching decisions:', error)
        })
      );
    }
    return this.api.get<Decision[]>('/decisions').pipe(
      tap({
        next: (decisions) => console.log('Received all decisions:', decisions),
        error: (error) => console.error('Error fetching all decisions:', error)
      })
    );
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