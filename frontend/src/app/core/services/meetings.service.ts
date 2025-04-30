import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Meeting } from '../models/meeting.model';

@Injectable({ providedIn: 'root' })
export class MeetingsService {
  constructor(private api: ApiService) {}

  list(): Observable<Meeting[]> {
    return this.api.get<Meeting[]>('/meetings');
  }

  detail(id: number): Observable<Meeting> {
    return this.api.get<Meeting>(`/meetings/${id}`);
  }

  create(data: Meeting): Observable<Meeting> {
    return this.api.post<Meeting>('/meetings', data);
  }

  update(id: number, data: Meeting): Observable<Meeting> {
    return this.api.put<Meeting>(`/meetings/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/meetings/${id}`);
  }

  addParticipant(meetingId: number, userId: number): Observable<Meeting> {
    return this.api.post<Meeting>(`/meetings/${meetingId}/participants?userId=${userId}`, {});
  }

  getUpcomingMeetings(start: string): Observable<Meeting[]> {
    return this.api.get<Meeting[]>(`/meetings/upcoming?start=${start}`);
  }

  getPastMeetings(start: string): Observable<Meeting[]> {
    return this.api.get<Meeting[]>(`/meetings/past?start=${start}`);
  }

  // Optionally, add methods to filter by virtualLink in the future
} 