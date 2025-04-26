import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TasksService {
  constructor(private api: ApiService) {}

  list(filters?: { assignedTo?: number; status?: string }): Observable<Task[]> {
    return this.api.get<Task[]>('/tasks', filters);
  }

  getById(id: number): Observable<Task> {
    return this.api.get<Task>(`/tasks/${id}`);
  }

  create(data: Task): Observable<Task> {
    return this.api.post<Task>('/tasks', data);
  }

  update(id: number, data: Task): Observable<Task> {
    return this.api.put<Task>(`/tasks/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/tasks/${id}`);
  }
  getTasksByDecision(id: number): Observable<Task[]> {
    return this.api.get<Task[]>(`/decisions/${id}`);
  }
}
