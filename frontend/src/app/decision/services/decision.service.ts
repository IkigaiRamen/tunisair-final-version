import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Decision } from '../models/decision.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DecisionService {
  private apiUrl = `${environment.apiUrl}/decisions`;

  constructor(private http: HttpClient) { }

  createDecision(decision: Partial<Decision>): Observable<Decision> {
    return this.http.post<Decision>(this.apiUrl, decision);
  }

  updateDecision(id: number, decision: Partial<Decision>): Observable<Decision> {
    return this.http.put<Decision>(`${this.apiUrl}/${id}`, decision);
  }

  deleteDecision(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getDecisionById(id: number): Observable<Decision> {
    return this.http.get<Decision>(`${this.apiUrl}/${id}`);
  }

  getDecisionsByMeeting(meetingId: number): Observable<Decision[]> {
    return this.http.get<Decision[]>(`${this.apiUrl}/meeting/${meetingId}`);
  }

  getDecisionsByProposer(proposerId: number): Observable<Decision[]> {
    return this.http.get<Decision[]>(`${this.apiUrl}/proposer/${proposerId}`);
  }

  getPendingDecisionsByMeeting(meetingId: number): Observable<Decision[]> {
    return this.http.get<Decision[]>(`${this.apiUrl}/meeting/${meetingId}/pending`);
  }

  markAsCompleted(id: number): Observable<Decision> {
    return this.http.put<Decision>(`${this.apiUrl}/${id}/complete`, {});
  }
} 