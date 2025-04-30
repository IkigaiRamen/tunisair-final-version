import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
import { FileUploadModule } from 'primeng/fileupload';
import { environment } from '../../../environments/environment';
import { MeetingsService } from '../../core/services/meetings.service';
import { DocumentsService } from '../../core/services/documents.service';
import { TasksService } from '../../core/services/tasks.service';

interface ActivityStats {
    meetingsAttended: number;
    lastMeetingDate: string;
    documentsUploaded: number;
    lastDocumentDate: string;
    tasksCompleted: number;
    lastTaskDate: string;
}

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
        DividerModule,
        FileUploadModule
    ],
    providers: [MessageService],
    template: `
        <div class="profile-container">
            <p-toast></p-toast>
            
            <!-- Profile Header -->
            <p-card styleClass="shadow-2 border-round-xl mb-5">
                <div class="flex flex-column md:flex-row align-items-center gap-4">
                    <div class="profile-picture-container">
                        <div class="profile-picture">
                            <img *ngIf="user?.profilePicture" 
                                 [src]="getImageUrl()" 
                                 alt="Profile Picture" 
                                 class="profile-img"
                                 (error)="handleImageError($event)">
                            <i class="pi pi-user text-5xl text-white" *ngIf="!user?.profilePicture"></i>
                        </div>
                        <p-fileUpload #fileUpload 
                            mode="basic" 
                            [auto]="true" 
                            accept="image/*" 
                            [maxFileSize]="5000000" 
                            (onSelect)="onFileSelect($event)" 
                            [customUpload]="true" 
                            chooseLabel="Edit Picture"
                            [showCancelButton]="false"
                            [showUploadButton]="false"
                            styleClass="p-button-secondary">
                        </p-fileUpload>
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
                    <p-card header="Edit Profile" styleClass="shadow-none">
                        <ng-template pTemplate="header">
                            <div class="flex align-items-center gap-2">
                                <i class="pi pi-user-edit text-primary text-2xl"></i>
                                <span class="text-2xl font-medium">Edit Profile</span>
                            </div>
                        </ng-template>

                        <div class="grid">
                            <!-- Personal Information -->
                            <div class="col-12">
                                <p-card header="Personal Information" styleClass="shadow-none">
                                    <div class="grid">
                                        <div class="col-12 md:col-6">
                                            <div class="field">
                                                <label for="fullName" class="block text-900 font-medium mb-2">Full Name</label>
                                                <input pInputText id="fullName" formControlName="fullName" 
                                                       class="w-full" [style]="{'width': '100%'}"
                                                       placeholder="Enter your full name">
                                                <small class="text-red-500 block mt-2" *ngIf="profileForm.get('fullName')?.invalid && profileForm.get('fullName')?.touched">
                                                    Full name is required
                                                </small>
                                            </div>
                                        </div>
                                        <div class="col-12 md:col-6">
                                            <div class="field">
                                                <label for="email" class="block text-900 font-medium mb-2">Email</label>
                                                <input pInputText id="email" type="email" formControlName="email" 
                                                       class="w-full" [style]="{'width': '100%'}"
                                                       placeholder="Enter your email">
                                                <small class="text-red-500 block mt-2" *ngIf="profileForm.get('email')?.invalid && profileForm.get('email')?.touched">
                                                    Please enter a valid email
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </p-card>
                            </div>

                            <!-- Change Password -->
                            <div class="col-12 mt-4">
                                <p-card header="Change Password" styleClass="shadow-none">
                                    <div class="grid">
                                        <div class="col-12 md:col-6">
                                            <div class="field">
                                                <label for="currentPassword" class="block text-900 font-medium mb-2">Current Password</label>
                                                <p-password id="currentPassword" formControlName="currentPassword" 
                                                          [toggleMask]="true" [feedback]="false" 
                                                          [style]="{'width': '100%'}"
                                                          placeholder="Enter current password"></p-password>
                                                <small class="text-red-500 block mt-2" *ngIf="profileForm.get('currentPassword')?.invalid && profileForm.get('currentPassword')?.touched">
                                                    Current password is required
                                                </small>
                                            </div>
                                        </div>
                                        <div class="col-12 md:col-6">
                                            <div class="field">
                                                <label for="newPassword" class="block text-900 font-medium mb-2">New Password</label>
                                                <p-password id="newPassword" formControlName="newPassword" 
                                                          [toggleMask]="true" [feedback]="false"
                                                          [style]="{'width': '100%'}"
                                                          placeholder="Enter new password"></p-password>
                                                <small class="text-red-500 block mt-2" *ngIf="profileForm.get('newPassword')?.invalid && profileForm.get('newPassword')?.touched">
                                                    New password must be at least 6 characters
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </p-card>
                            </div>
                        </div>

                        <ng-template pTemplate="footer">
                            <div class="flex justify-content-end gap-3">
                                <p-button type="button" label="Cancel" icon="pi pi-times" 
                                         (onClick)="toggleEditMode()" styleClass="p-button-outlined"></p-button>
                                <p-button type="submit" label="Save Changes" icon="pi pi-check" 
                                         [loading]="loading" styleClass="p-button-primary"></p-button>
                            </div>
                        </ng-template>
                    </p-card>
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
                            <div class="activity-number">{{activityStats.meetingsAttended}}</div>
                            <div class="activity-title">Meetings Attended</div>
                            <div class="activity-subtitle" *ngIf="activityStats.lastMeetingDate">
                                Last meeting: {{activityStats.lastMeetingDate}}
                            </div>
                        </div>
                    </div>
                    <div class="activity-card">
                        <div class="activity-icon">
                            <i class="pi pi-file text-primary text-4xl"></i>
                        </div>
                        <div class="activity-content">
                            <div class="activity-number">{{activityStats.documentsUploaded}}</div>
                            <div class="activity-title">Documents Uploaded</div>
                            <div class="activity-subtitle" *ngIf="activityStats.lastDocumentDate">
                                Last upload: {{activityStats.lastDocumentDate}}
                            </div>
                        </div>
                    </div>
                    <div class="activity-card">
                        <div class="activity-icon">
                            <i class="pi pi-check-circle text-primary text-4xl"></i>
                        </div>
                        <div class="activity-content">
                            <div class="activity-number">{{activityStats.tasksCompleted}}</div>
                            <div class="activity-title">Tasks Completed</div>
                            <div class="activity-subtitle" *ngIf="activityStats.lastTaskDate">
                                Last task: {{activityStats.lastTaskDate}}
                            </div>
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
        .profile-picture-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            align-items: center;
        }
        .profile-picture {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background-color: var(--primary-color);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 4px solid var(--surface-card);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .profile-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
        }
        .profile-picture-upload {
            position: absolute;
            bottom: 0;
            right: 0;
            background-color: var(--surface-card);
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            cursor: pointer;
            z-index: 10;
            transition: all 0.2s ease;
        }
        .profile-picture-upload:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        .profile-picture-upload ::ng-deep .p-fileupload-buttonbar {
            padding: 0;
            background: transparent;
            border: none;
        }
        .profile-picture-upload ::ng-deep .p-button {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--primary-color);
            border-color: var(--primary-color);
            color: white;
        }
        .profile-picture-upload ::ng-deep .p-button:hover {
            background-color: var(--primary-600);
            border-color: var(--primary-600);
        }
        .profile-picture-upload ::ng-deep .p-button .p-button-icon {
            font-size: 1rem;
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
        .debug-url {
            position: absolute;
            top: 0;
            left: 0;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 5px;
            font-size: 10px;
            z-index: 100;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .hidden {
            display: none;
        }
    `]
})
export class ProfileComponent implements OnInit {
    profileForm!: FormGroup;
    user: User | null = null;
    loading = false;
    isEditMode = false;
    selectedFile: File | null = null;
    @ViewChild('fileUpload') fileUpload!: ElementRef;
    activityStats: ActivityStats = {
        meetingsAttended: 0,
        lastMeetingDate: '',
        documentsUploaded: 0,
        lastDocumentDate: '',
        tasksCompleted: 0,
        lastTaskDate: ''
    };

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private usersService: UsersService,
        private messageService: MessageService,
        private router: Router,
        private meetingsService: MeetingsService,
        private documentsService: DocumentsService,
        private tasksService: TasksService
    ) {}

    ngOnInit(): void {
        this.user = this.authService.getUser();
        this.initForm();
        
        console.log('User object:', this.user);
        if (this.user?.profilePicture) {
            console.log('Profile picture URL:', this.user.profilePicture);
            console.log('Full image URL:', this.getImageUrl());
        }
        this.loadActivityStats();
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

    onFileSelect(event: any): void {
        if (event.files && event.files.length > 0) {
            this.selectedFile = event.files[0];
            
            // Validate file type
            if (this.selectedFile && !this.selectedFile.type.startsWith('image/')) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Please select an image file'
                });
                return;
            }
            
            // Validate file size (max 5MB)
            if (this.selectedFile && this.selectedFile.size > 5 * 1024 * 1024) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'File size should be less than 5MB'
                });
                return;
            }
            
            // Auto upload the file
            this.uploadProfilePicture();
        }
    }

    uploadProfilePicture(): void {
        if (!this.selectedFile || !this.user) return;
        
        this.loading = true;
        
        this.usersService.updateProfilePicture(this.user.id, this.selectedFile).subscribe({
            next: (updatedUser) => {
                this.user = updatedUser;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Profile picture updated successfully'
                });
                this.loading = false;
            },
            error: (error) => {
                console.error('Error updating profile picture:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to update profile picture'
                });
                this.loading = false;
            }
        });
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
    }

    getImageUrl(): string {
        if (!this.user?.profilePicture) {
            return '';
        }
        
        // Check if the URL is already absolute
        if (this.user.profilePicture.startsWith('http')) {
            return this.user.profilePicture;
        }
        
        // Otherwise, prepend the API URL
        return `${environment.apiUrl}${this.user.profilePicture}`;
    }
    
    handleImageError(event: any): void {
        console.error('Error loading image:', event);
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load profile picture'
        });
    }

    triggerFileInput(): void {
        const fileInput = this.fileUpload.nativeElement.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.click();
        }
    }

    private loadActivityStats(): void {
        if (!this.user) return;

        // Load meetings attended
        const start = new Date().toISOString();
        this.meetingsService.getPastMeetings(start).subscribe((meetings: any[]) => {
            // Filter meetings where the current user is a participant
            const userMeetings = meetings.filter(meeting => 
                meeting.participants.some((participant: User) => participant.id === this.user?.id)
            );
            this.activityStats.meetingsAttended = userMeetings.length;
            if (userMeetings.length > 0) {
                const lastMeeting = userMeetings.sort((a: any, b: any) => 
                    new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())[0];
                this.activityStats.lastMeetingDate = this.formatDate(lastMeeting.dateTime);
            }
        });

        // Load documents uploaded
        this.documentsService.list().subscribe((documents: any[]) => {
            const userDocuments = documents.filter((doc: any) => doc.uploadedBy.id === this.user?.id);
            this.activityStats.documentsUploaded = userDocuments.length;
            if (userDocuments.length > 0) {
                const lastDocument = userDocuments.sort((a: any, b: any) => 
                    new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())[0];
                this.activityStats.lastDocumentDate = this.formatDate(lastDocument.uploadDate);
            }
        });

        // Load tasks completed
        this.tasksService.list().subscribe((tasks: any[]) => {
            const userTasks = tasks.filter((task: any) => task.assignedTo.id === this.user?.id);
            const completedTasks = userTasks.filter((t: any) => t.status === 'COMPLETED');
            this.activityStats.tasksCompleted = completedTasks.length;
            if (completedTasks.length > 0) {
                const lastTask = completedTasks.sort((a: any, b: any) => 
                    new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime())[0];
                this.activityStats.lastTaskDate = this.formatDate(lastTask.completionDate);
            }
        });
    }

    private formatDate(date: string): string {
        const now = new Date();
        const taskDate = new Date(date);
        const diffDays = Math.floor((now.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'today';
        if (diffDays === 1) return 'yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    }
} 