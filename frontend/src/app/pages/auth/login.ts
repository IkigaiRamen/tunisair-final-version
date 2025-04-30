import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from '../../core/services/auth.service';
import { MessageService } from 'primeng/api';
import { RoleName } from '../../core/models/role-name.model';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, ReactiveFormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    providers: [MessageService],
    template: `
      <app-floating-configurator />
      <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
          <div class="flex flex-col items-center justify-center">
              <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, red 10%, rgba(255, 0, 0, 0) 30%)">
                  <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                      <div class="text-center mb-8">
                          <img src="assets/images/Tunisair.png" alt="Tunisair Logo" height="200" width="300" class="mx-auto" />
                          
                          <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">
                              Welcome to Tunisair Meetings!
                          </div>
                          <span class="text-muted-color font-medium">Sign in to continue</span>
                      </div>
                      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                          <div>
                              <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                              <input pInputText id="email" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" formControlName="email" />

                              <label for="password" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                              <p-password id="password" formControlName="password" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                              <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                  <span class="font-medium no-underline ml-2 text-right cursor-pointer text-red-600">Forgot password?</span>
                              </div>
                              <div class="flex items-center justify-center mb-4">
                                  <span class="text-surface-600 dark:text-surface-300">Don't have an account?</span>
                                  <a routerLink="/signup" class="text-primary hover:underline ml-2">Sign up</a>
                              </div>
                              <p-button type="submit" label="Sign In" styleClass="w-full p-button-danger" [loading]="loading"></p-button>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      </div>
    `
})
export class Login implements OnInit {
    loginForm!: FormGroup;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ) { }

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
            next: (res) => {
                this.authService.setToken(res.token);
                
                // Fetch the complete user data including profile picture
                this.authService.me().subscribe({
                    next: (user) => {
                        this.authService.setUser(user);
                        this.messageService.add({ severity: 'success', summary: 'Login Successful', detail: 'Welcome back!' });
                        this.router.navigate(['/meetings/upcoming']);
                        this.loading = false;
                    },
                    error: (err) => {
                        console.error('Error fetching user data:', err);
                        // Fallback to basic user data if fetching complete data fails
                        const basicUser = {
                            id: res.id,
                            fullName: res.fullName,
                            email: res.email,
                            roles: res.roles.map((roleName) => ({ id: 0, name: roleName as RoleName })),
                            enabled: true
                        };
                        this.authService.setUser(basicUser);
                        this.messageService.add({ severity: 'success', summary: 'Login Successful', detail: 'Welcome back!' });
                        this.router.navigate(['/meetings/upcoming']);
                        this.loading = false;
                    }
                });
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: err.error?.message || 'Please try again' });
                this.loading = false;
            }
        });
    }
}
