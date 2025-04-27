import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { LoginRequest } from '../models/login-request.model';
import { SignupRequest } from '../models/signup-request.model';
import { JwtResponse } from '../models/jwt-response.model';
import { MessageResponse } from '../models/message-response.model';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(private api: ApiService, private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

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

  verifyPassword(password: string): Observable<boolean> {
    return this.api.post<boolean>('/auth/verify-password', { password });
  }
} 