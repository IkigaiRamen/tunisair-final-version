import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user.model';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private api: ApiService) {}

  getAll(): Observable<User[]> {
    return this.api.get<User[]>('/users');
  }

  getById(id: number): Observable<User> {
    return this.api.get<User>(`/users/${id}`);
  }

  create(user: User): Observable<User> {
    return this.api.post<User>('/users', user);
  }

  update(id: number, user: User): Observable<User> {
    // Only send the necessary fields for password update
    const updateData = {
        fullName: user.fullName,
        email: user.email,
        password: user.password
    };

    return this.api.put<User>(`/users/${id}`, updateData).pipe(
        catchError(error => {
            console.error('Error updating user:', error);
            throw error;
        })
    );
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/users/${id}`);
  }

  getByRole(role: string): Observable<User[]> {
    return this.api.get<User[]>(`/users/role/${role}`);
  }
} 