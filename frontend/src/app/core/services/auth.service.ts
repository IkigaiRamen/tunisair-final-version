import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { LoginRequest } from '../models/login-request.model';
import { SignupRequest } from '../models/signup-request.model';
import { JwtResponse } from '../models/jwt-response.model';
import { MessageResponse } from '../models/message-response.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private api: ApiService) {}

  login(credentials: LoginRequest): Observable<JwtResponse> {
    return this.api.post<JwtResponse>('/auth/login', credentials);
  }

  signup(data: SignupRequest): Observable<MessageResponse> {
    return this.api.post<MessageResponse>('/auth/signup', data);
  }

  signupAdmin(data: SignupRequest): Observable<MessageResponse> {
    return this.api.post<MessageResponse>('/auth/signup/admin', data);
  }

  me(): Observable<User> {
    return this.api.get<User>('/auth/me');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): User | null {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) as User : null;
  }
} 