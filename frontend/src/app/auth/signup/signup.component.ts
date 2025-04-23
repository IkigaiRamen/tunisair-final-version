import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'], 
  standalone: true,
  imports: [
    ToastModule,
    CardModule,
    CommonModule,
    ReactiveFormsModule,
    PasswordModule,
    ButtonModule,
    InputTextModule
  ],
  providers: [MessageService]
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.authService.signup({
      ...this.signupForm.value,
      roles: ['ROLE_USER']
    }).subscribe({
      next: res => {
        this.messageService.add({ severity: 'success', summary: 'Registration successful', detail: res.message });
        this.router.navigate(['/login']);
      },
      error: err => {
        this.messageService.add({ severity: 'error', summary: 'Registration failed', detail: err.error?.message || 'Please try again' });
        this.loading = false;
      }
    });
  }
}
