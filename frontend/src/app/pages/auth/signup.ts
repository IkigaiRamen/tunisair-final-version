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
    selector: 'app-signup',
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
                            <span class="text-muted-color font-medium">Sign up to continue</span>
                        </div>
                        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
                            <div>
                                <label for="fullName" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Full name</label>
                                <input pInputText id="fullName" type="text" placeholder="Enter your name" class="w-full md:w-[30rem] mb-8" formControlName="fullName" />

                                <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                                <input pInputText id="email" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" formControlName="email" />

                                <label for="password" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                                <p-password id="password" formControlName="password" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                                <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                    <span class="font-medium no-underline ml-2 text-right cursor-pointer text-red-600">Forgot password?</span>
                                </div>
                                <p-button type="submit" label="Sign Up" styleClass="w-full p-button-danger" [loading]="loading"></p-button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class signup implements OnInit {
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
        this.authService
            .signup({
                ...this.signupForm.value,
                roles: ['ROLE_USER']
            })
            .subscribe({
                next: (res) => {
                    this.messageService.add({ severity: 'success', summary: 'Registration successful', detail: res.message });
                    this.router.navigate(['/login']);
                },
                error: (err) => {
                    this.messageService.add({ severity: 'error', summary: 'Registration failed', detail: err.error?.message || 'Please try again' });
                    this.loading = false;
                }
            });
    }
}
