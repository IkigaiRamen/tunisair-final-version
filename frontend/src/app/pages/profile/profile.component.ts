import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        CardModule,
        InputTextModule,
        PasswordModule,
        ToastModule
    ],
    providers: [MessageService],
    template: `
        <div class="grid">
            <div class="col-12 md:col-6 md:col-offset-3">
                <p-toast></p-toast>
                <p-card header="Profile Information" styleClass="shadow-2">
                    <div class="flex flex-column gap-4">
                        <div class="flex align-items-center gap-3">
                            <i class="pi pi-user text-4xl text-primary"></i>
                            <div>
                                <h2 class="text-2xl font-bold m-0">{{user?.fullName}}</h2>
                                <span class="text-500">{{user?.email}}</span>
                            </div>
                        </div>

                        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="flex flex-column gap-4">
                            <div class="field">
                                <label for="fullName" class="block text-900 font-medium mb-2">Full Name</label>
                                <input id="fullName" type="text" pInputText formControlName="fullName" class="w-full" />
                                <small class="text-red-500" *ngIf="profileForm.get('fullName')?.invalid && profileForm.get('fullName')?.touched">
                                    Full name is required
                                </small>
                            </div>

                            <div class="field">
                                <label for="email" class="block text-900 font-medium mb-2">Email</label>
                                <input id="email" type="email" pInputText formControlName="email" class="w-full" />
                                <small class="text-red-500" *ngIf="profileForm.get('email')?.invalid && profileForm.get('email')?.touched">
                                    Please enter a valid email
                                </small>
                            </div>

                            <div class="field">
                                <label for="currentPassword" class="block text-900 font-medium mb-2">Current Password</label>
                                <p-password id="currentPassword" formControlName="currentPassword" [toggleMask]="true" [feedback]="false" styleClass="w-full"></p-password>
                                <small class="text-red-500" *ngIf="profileForm.get('currentPassword')?.invalid && profileForm.get('currentPassword')?.touched">
                                    Current password is required
                                </small>
                            </div>

                            <div class="field">
                                <label for="newPassword" class="block text-900 font-medium mb-2">New Password</label>
                                <p-password id="newPassword" formControlName="newPassword" [toggleMask]="true" [feedback]="false" styleClass="w-full"></p-password>
                                <small class="text-red-500" *ngIf="profileForm.get('newPassword')?.invalid && profileForm.get('newPassword')?.touched">
                                    New password must be at least 6 characters
                                </small>
                            </div>

                            <div class="flex justify-content-end">
                                <p-button type="submit" label="Update Profile" [loading]="loading" styleClass="p-button-primary"></p-button>
                            </div>
                        </form>
                    </div>
                </p-card>
            </div>
        </div>
    `,
    styles: [`
        :host ::ng-deep {
            .p-card {
                .p-card-content {
                    padding: 2rem;
                }
            }
        }
    `]
})
export class ProfileComponent implements OnInit {
    profileForm!: FormGroup;
    user: User | null = null;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.user = this.authService.getUser();
        this.initForm();
    }

    private initForm(): void {
        this.profileForm = this.fb.group({
            fullName: [this.user?.fullName || '', Validators.required],
            email: [this.user?.email || '', [Validators.required, Validators.email]],
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.minLength(6)]]
        });
    }

    onSubmit(): void {
        if (this.profileForm.invalid) {
            this.profileForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        const formData = this.profileForm.value;

        // Here you would typically call your API to update the profile
        // For now, we'll just simulate a successful update
        setTimeout(() => {
            this.loading = false;
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Profile updated successfully'
            });
        }, 1000);
    }
} 