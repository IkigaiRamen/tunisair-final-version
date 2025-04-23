import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { RoleName } from '../../core/models/role-name.model';

import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [

    CardModule,
    CommonModule,
    ReactiveFormsModule,
    PasswordModule,
    ButtonModule,
    InputTextModule
  ],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: res => {
        this.authService.setToken(res.token);
        const user = {
          id: res.id,
          fullName: res.fullName,
          email: res.email,
          roles: res.roles.map(roleName => ({ id: 0, name: roleName as RoleName })),
          enabled: true
        };
        this.authService.setUser(user);
        this.messageService.add({ severity: 'success', summary: 'Login Successful', detail: 'Welcome back!' });
        this.router.navigate(['/']);
      },
      error: err => {
        this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: err.error?.message || 'Please try again' });
        this.loading = false;
      }
    });
  }
}
