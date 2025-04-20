import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskStatus, TaskPriority } from '../models/task.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) { }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  getTasksByAssignee(assigneeId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/assignee/${assigneeId}`);
  }

  getTasksByStatus(status: TaskStatus): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/status/${status}`);
  }

  getTasksByPriority(priority: TaskPriority): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/priority/${priority}`);
  }

  getOverdueTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/overdue`);
  }

  getTasksByDateRange(startDate: Date, endDate: Date): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/date-range`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
  }

  updateTaskStatus(id: number, status: TaskStatus): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}/status`, { status });
  }

  updateTaskPriority(id: number, priority: TaskPriority): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}/priority`, { priority });
  }

  assignTask(id: number, assigneeId: number): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}/assign`, { assigneeId });
  }
} 