import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Task, TaskPriority, TaskStatus } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) { }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTasksByStatus(status: TaskStatus): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/status/${status}`);
  }

  getTasksByPriority(priority: TaskPriority): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/priority/${priority}`);
  }

  getTasksByAssignee(userId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/assignee/${userId}`);
  }

  getTasksByDateRange(startDate: Date, endDate: Date): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/date-range`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
  }

  getOverdueTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/overdue`);
  }

  updateTaskStatus(id: number, status: TaskStatus): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}/status`, { status });
  }

  updateTaskPriority(id: number, priority: TaskPriority): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}/priority`, { priority });
  }

  assignTask(id: number, userId: number): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}/assign`, { userId });
  }

  markAsCompleted(id: number): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}/complete`, {});
  }

  getTasksByDecision(decisionId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/decision/${decisionId}`);
  }

  getTasksByMeeting(meetingId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/meeting/${meetingId}`);
  }

  getPendingTasksByUser(userId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/pending/user/${userId}`);
  }
} 