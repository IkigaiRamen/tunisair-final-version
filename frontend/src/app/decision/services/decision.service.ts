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

  constructor(private http: HttpClient) {}

  createDecision(decision: Partial<Decision>): Observable<Decision> {
    return this.http.post<Decision>(this.apiUrl, decision);
  }

  updateDecision(decisionId: number, decision: Partial<Decision>): Observable<Decision> {
    return this.http.put<Decision>(`${this.apiUrl}/${decisionId}`, decision);
  }

  deleteDecision(decisionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${decisionId}`);
  }

  getDecisionById(decisionId: number): Observable<Decision> {
    return this.http.get<Decision>(`${this.apiUrl}/${decisionId}`);
  }

  getAllDecisions(): Observable<Decision[]> {
    return this.http.get<Decision[]>(this.apiUrl);
  }

  getDecisionsByMeeting(meetingId: number): Observable<Decision[]> {
    return this.http.get<Decision[]>(`${this.apiUrl}/meeting/${meetingId}`);
  }

  getDecisionsByProposer(userId: number): Observable<Decision[]> {
    return this.http.get<Decision[]>(`${this.apiUrl}/proposer/${userId}`);
  }

  getPendingDecisionsByMeeting(meetingId: number): Observable<Decision[]> {
    return this.http.get<Decision[]>(`${this.apiUrl}/meeting/${meetingId}/pending`);
  }

  updateDecisionStatus(decisionId: number, status: string): Observable<Decision> {
    return this.http.patch<Decision>(`${this.apiUrl}/${decisionId}/status`, { status });
  }
} 