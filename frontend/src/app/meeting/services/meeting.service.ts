import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Meeting, MeetingStatus } from '../models/meeting.model';
import { User } from '../../user/models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private apiUrl = `${environment.apiUrl}/meetings`;

  constructor(private http: HttpClient) { }

  createMeeting(meeting: Partial<Meeting>): Observable<Meeting> {
    return this.http.post<Meeting>(this.apiUrl, meeting);
  }

  updateMeeting(id: number, meeting: Partial<Meeting>): Observable<Meeting> {
    return this.http.put<Meeting>(`${this.apiUrl}/${id}`, meeting);
  }

  deleteMeeting(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getMeetingById(id: number): Observable<Meeting> {
    return this.http.get<Meeting>(`${this.apiUrl}/${id}`);
  }

  getAllMeetings(): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(this.apiUrl);
  }

  getMeetingsByOrganizer(userId: number): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this.apiUrl}/organizer/${userId}`);
  }

  getMeetingsByParticipant(userId: number): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this.apiUrl}/participant/${userId}`);
  }

  getMeetingsByDateRange(startDate: Date, endDate: Date): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this.apiUrl}/date-range`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
  }

  getUpcomingMeetings(): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this.apiUrl}/upcoming`);
  }

  getOverdueMeetings(): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this.apiUrl}/overdue`);
  }

  addParticipant(meetingId: number, userId: number): Observable<Meeting> {
    return this.http.put<Meeting>(`${this.apiUrl}/${meetingId}/participants/add`, { userId });
  }

  removeParticipant(meetingId: number, userId: number): Observable<Meeting> {
    return this.http.put<Meeting>(`${this.apiUrl}/${meetingId}/participants/remove`, { userId });
  }

  markAsCompleted(meetingId: number): Observable<Meeting> {
    return this.http.put<Meeting>(`${this.apiUrl}/${meetingId}/status`, { status: MeetingStatus.COMPLETED });
  }

  updateMeetingStatus(meetingId: number, status: MeetingStatus): Observable<Meeting> {
    return this.http.put<Meeting>(`${this.apiUrl}/${meetingId}/status`, { status });
  }
} 