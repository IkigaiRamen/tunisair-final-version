import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { NotificationLog } from '../models/notification-log.model';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  constructor(private api: ApiService) {}

  list(): Observable<NotificationLog[]> {
    return this.api.get<NotificationLog[]>('/notifications');
  }

  send(data: NotificationLog): Observable<NotificationLog> {
    return this.api.post<NotificationLog>('/notifications', data);
  }

  markRead(id: number): Observable<void> {
    return this.api.put<void>(`/notifications/${id}/read`, null);
  }

  deleteUserNotifications(): Observable<void> {
    return this.api.delete<void>(`/notifications`);
  }
} 