import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
import { UsersService } from '../../core/services/users.service';
import { User } from '../../core/models/user.model';
import { Router } from '@angular/router';

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
        ToastModule,
        TabViewModule,
        DividerModule
    ],
    providers: [MessageService],
    template: `
        <div class="profile-container">
            <p-toast></p-toast>
            
            <!-- Profile Header -->
            <p-card styleClass="shadow-2 border-round-xl mb-5">
                <div class="flex flex-column md:flex-row align-items-center gap-4">
                    <div class="flex align-items-center justify-content-center bg-primary border-circle shadow-2" 
                         style="width: 120px; height: 120px; border: 4px solid var(--surface-card);">
                        <i class="pi pi-user text-5xl text-white"></i>
                    </div>
                    <div class="flex-1">
                        <h2 class="text-3xl font-bold m-0 mb-2">{{user?.fullName}}</h2>
                        <span class="text-500 block mb-3 text-xl">{{user?.email}}</span>
                        <div class="flex gap-2">
                            <span class="p-tag p-tag-success p-tag-rounded" *ngFor="let role of user?.roles">
                                {{role.name}}
                            </span>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <p-button icon="pi pi-pencil" label="Edit Profile" (onClick)="toggleEditMode()" 
                                 styleClass="p-button-outlined p-button-rounded"></p-button>
                        <p-button icon="pi pi-sign-out" label="Logout" (onClick)="logout()" 
                                 styleClass="p-button-danger p-button-outlined p-button-rounded"></p-button>
                    </div>
                </div>
            </p-card>

            <!-- Edit Profile Form -->
            <div *ngIf="isEditMode" class="surface-card p-5 border-round-xl shadow-2 mb-5">
                <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="flex flex-column gap-5">
                    <!-- Personal Info Section -->
                    <div class="flex flex-column gap-4">
                        <div class="flex align-items-center gap-3">
                            <i class="pi pi-user text-primary text-2xl"></i>
                            <h3 class="text-2xl font-medium m-0">Personal Information</h3>
                        </div>
                        
                        <div class="grid">
                            <div class="col-12 md:col-6">
                                <div class="field">
                                    <label for="fullName" class="block text-900 font-medium mb-2">Full Name</label>
                                    <input id="fullName" type="text" pInputText formControlName="fullName" 
                                           class="w-full" />
                                    <small class="text-red-500 block mt-2" *ngIf="profileForm.get('fullName')?.invalid && profileForm.get('fullName')?.touched">
                                        Full name is required
                                    </small>
                                </div>
                            </div>
                            <div class="col-12 md:col-6">
                                <div class="field">
                                    <label for="email" class="block text-900 font-medium mb-2">Email</label>
                                    <input id="email" type="email" pInputText formControlName="email" 
                                           class="w-full" />
                                    <small class="text-red-500 block mt-2" *ngIf="profileForm.get('email')?.invalid && profileForm.get('email')?.touched">
                                        Please enter a valid email
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Password Section -->
                    <div class="flex flex-column gap-4">
                        <div class="flex align-items-center gap-3">
                            <i class="pi pi-lock text-primary text-2xl"></i>
                            <h3 class="text-2xl font-medium m-0">Change Password</h3>
                        </div>
                        <div class="grid">
                            <div class="col-12 md:col-6">
                                <div class="field">
                                    <label for="currentPassword" class="block text-900 font-medium mb-2">Current Password</label>
                                    <p-password id="currentPassword" formControlName="currentPassword" [toggleMask]="true" 
                                              [feedback]="false" styleClass="w-full"></p-password>
                                    <small class="text-red-500 block mt-2" *ngIf="profileForm.get('currentPassword')?.invalid && profileForm.get('currentPassword')?.touched">
                                        Current password is required
                                    </small>
                                </div>
                            </div>
                            <div class="col-12 md:col-6">
                                <div class="field">
                                    <label for="newPassword" class="block text-900 font-medium mb-2">New Password</label>
                                    <p-password id="newPassword" formControlName="newPassword" [toggleMask]="true" 
                                              [feedback]="false" styleClass="w-full"></p-password>
                                    <small class="text-red-500 block mt-2" *ngIf="profileForm.get('newPassword')?.invalid && profileForm.get('newPassword')?.touched">
                                        New password must be at least 6 characters
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-content-end gap-3 mt-5">
                        <p-button type="button" label="Cancel" (onClick)="toggleEditMode()" 
                                 styleClass="p-button-outlined"></p-button>
                        <p-button type="submit" label="Save Changes" [loading]="loading" 
                                 styleClass="p-button-primary"></p-button>
                    </div>
                </form>
            </div>

            <!-- Recent Activity -->
            <div class="surface-card p-5 border-round-xl shadow-2">
                <div class="section-header mb-5">
                    <i class="pi pi-chart-line text-primary text-2xl"></i>
                    <h3 class="text-2xl font-medium m-0">Recent Activity</h3>
                </div>
                <div class="activity-container">
                    <div class="activity-card">
                        <div class="activity-icon">
                            <i class="pi pi-calendar text-primary text-4xl"></i>
                        </div>
                        <div class="activity-content">
                            <div class="activity-number">5</div>
                            <div class="activity-title">Meetings Attended</div>
                            <div class="activity-subtitle">Last meeting: 2 days ago</div>
                        </div>
                    </div>
                    <div class="activity-card">
                        <div class="activity-icon">
                            <i class="pi pi-file text-primary text-4xl"></i>
                        </div>
                        <div class="activity-content">
                            <div class="activity-number">3</div>
                            <div class="activity-title">Documents Uploaded</div>
                            <div class="activity-subtitle">Last upload: 1 week ago</div>
                        </div>
                    </div>
                    <div class="activity-card">
                        <div class="activity-icon">
                            <i class="pi pi-check-circle text-primary text-4xl"></i>
                        </div>
                        <div class="activity-content">
                            <div class="activity-number">8</div>
                            <div class="activity-title">Tasks Completed</div>
                            <div class="activity-subtitle">Last task: 3 days ago</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .profile-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
        }
        .section-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--surface-border);
        }
        .form-section {
            background-color: var(--surface-ground);
            padding: 2rem;
            border-radius: 1rem;
            margin-bottom: 2rem;
        }
        .form-field {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-bottom: 2rem;
        }
        .form-field:last-child {
            margin-bottom: 0;
        }
        .form-field label {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-color);
        }
        .form-field input,
        .form-field .p-password {
            height: 3.5rem;
            font-size: 1.1rem;
        }
        .form-field small {
            font-size: 0.875rem;
            margin-top: 0.5rem;
        }
        .activity-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        .activity-card {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            padding: 1.5rem;
            background-color: var(--surface-ground);
            border-radius: 1rem;
            transition: all 0.3s ease;
        }
        .activity-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
        .activity-icon {
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--primary-50);
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        .activity-card:hover .activity-icon {
            transform: scale(1.1);
        }
        .activity-content {
            flex: 1;
        }
        .activity-number {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }
        .activity-title {
            font-size: 1.25rem;
            color: var(--text-color);
            margin-bottom: 0.25rem;
        }
        .activity-subtitle {
            font-size: 0.875rem;
            color: var(--text-color-secondary);
        }
        :host ::ng-deep {
            .p-card {
                .p-card-content {
                    padding: 2rem;
                }
            }
            .p-button {
                &.p-button-rounded {
                    border-radius: 2rem;
                }
            }
            .p-inputtext {
                &.p-component {
                    border-radius: 1rem;
                }
            }
            .p-password {
                &.p-component {
                    .p-password-input {
                        border-radius: 1rem;
                    }
                }
            }
            .surface-card {
                background: var(--surface-card);
                border: 1px solid var(--surface-border);
                transition: transform 0.2s, box-shadow 0.2s;
                &:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
            }
        }
    `]
})
export class ProfileComponent implements OnInit {
    profileForm!: FormGroup;
    user: User | null = null;
    loading = false;
    isEditMode = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private usersService: UsersService,
        private messageService: MessageService,
        private router: Router
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

    toggleEditMode(): void {
        this.isEditMode = !this.isEditMode;
        if (!this.isEditMode) {
            this.profileForm.reset({
                fullName: this.user?.fullName || '',
                email: this.user?.email || '',
                currentPassword: '',
                newPassword: ''
            });
        }
    }

    onSubmit(): void {
        if (this.profileForm.valid) {
            const currentPassword = this.profileForm.get('currentPassword')?.value;
            const newPassword = this.profileForm.get('newPassword')?.value;

            // First verify the current password
            this.authService.verifyPassword(currentPassword).subscribe({
                next: (isValid) => {
                    console.log('Password verification result:', isValid);
                    if (isValid) {
                        // Prepare the update data
                        const updateData = {
                            ...this.user!,
                            fullName: this.profileForm.get('fullName')?.value,
                            email: this.profileForm.get('email')?.value,
                            password: newPassword || undefined
                        };

                        // Update the user
                        this.usersService.update(this.user!.id, updateData).subscribe({
                            next: (updatedUser) => {
                                this.user = updatedUser;
                                this.authService.setUser(updatedUser);
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Success',
                                    detail: 'Profile updated successfully'
                                });
                                this.isEditMode = false;
                                this.profileForm.reset();
                            },
                            error: (error) => {
                                console.error('Error updating profile:', error);
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'Error updating profile'
                                });
                            }
                        });
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Current password is incorrect'
                        });
                    }
                },
                error: (error) => {
                    console.error('Error verifying password:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error verifying password'
                    });
                }
            });
        }
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
    }
} 