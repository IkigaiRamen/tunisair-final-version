import { Component, OnInit } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MeetingsService } from '../../core/services/meetings.service';
import { Meeting } from '../../core/models/meeting.model';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
    selector: 'app-past-meetings',
    standalone: true,
    imports: [CommonModule, TimelineModule, ButtonModule, CardModule, RouterModule, ToastModule],
    template: `
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-full">
            <div class="card">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">Past Meetings Timeline</h2>
                </div>
                <p-toast></p-toast>
                <div *ngIf="loading" class="text-center p-4">
                    <p class="text-lg text-surface-600">Loading past meetings...</p>
                </div>
                <div *ngIf="!loading && meetings.length === 0" class="text-center p-4">
                    <p class="text-lg text-surface-600">No past meetings found.</p>
                </div>
                <p-timeline *ngIf="!loading && meetings.length > 0" [value]="meetings" align="alternate" styleClass="customized-timeline">
                    <ng-template #marker let-meeting>
                        <span class="flex w-10 h-10 items-center justify-center text-white rounded-full z-10 shadow-md bg-primary">
                            <i class="pi pi-calendar text-lg"></i>
                        </span>
                    </ng-template>
                    <ng-template #content let-meeting>
                        <div class="p-4">
                            <p-card [header]="meeting.title" [subheader]="formatDate(meeting.dateTime)" 
                                   styleClass="shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div class="flex flex-col gap-4">
                                    <div *ngIf="meeting.agenda" class="field">
                                        <label class="font-bold text-sm text-surface-600">Agenda:</label>
                                        <p class="mt-1">{{ meeting.agenda }}</p>
                                    </div>
                                    <div *ngIf="meeting.objectives" class="field">
                                        <label class="font-bold text-sm text-surface-600">Objectives:</label>
                                        <p class="mt-1">{{ meeting.objectives }}</p>
                                    </div>
                                    <div class="field">
                                        <label class="font-bold text-sm text-surface-600">Created By:</label>
                                        <p class="mt-1">{{ meeting.createdBy?.fullName || 'N/A' }}</p>
                                    </div>
                                    <div class="field">
                                        <label class="font-bold text-sm text-surface-600">Participants:</label>
                                        <div class="flex flex-wrap gap-2 mt-1">
                                            <span *ngFor="let participant of meeting.participants" 
                                                  class="px-2 py-1 bg-surface-100 rounded-full text-sm">
                                                {{ participant.fullName }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="flex justify-end mt-4">
                                        <p-button label="View Details" icon="pi pi-eye" 
                                                  [routerLink]="['/meetings', meeting.id]"
                                                  styleClass="p-button-sm" />
                                    </div>
                                </div>
                            </p-card>
                        </div>
                    </ng-template>
                </p-timeline>
            </div>
        </div>
    </div>
    `,
    styles: [`
        :host ::ng-deep {
            .customized-timeline {
                .p-timeline-event-content {
                    line-height: 1;
                }
                .p-timeline-event-opposite {
                    display: none;
                }
                .p-timeline-event-connector {
                    background-color: var(--surface-200);
                }
            }
        }
    `],
    providers: [MeetingsService, MessageService, AuthService]
})
export class pastMeetings implements OnInit {
    meetings: Meeting[] = [];
    loading: boolean = true;
    currentUser: User | null = null;

    constructor(
        private meetingsService: MeetingsService,
        private messageService: MessageService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.currentUser = this.authService.getUser();
        if (this.currentUser) {
            this.loadPastMeetings();
        }
    }

    loadPastMeetings(): void {
        this.loading = true;
        const start = new Date().toISOString();    
        
        this.meetingsService.getPastMeetings(start).subscribe({
            next: (meetings: Meeting[]) => {
                // Filter meetings where the current user is a participant
                const userMeetings = meetings.filter(meeting => 
                    meeting.participants.some(participant => participant.id === this.currentUser?.id)
                );
                // Sort meetings by date in descending order (most recent first)
                this.meetings = userMeetings.sort((a, b) => 
                    new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
                );
                this.loading = false;
            },
            error: (error: any) => {
                console.error('Error fetching past meetings:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load past meetings. Please try again later.',
                    life: 3000
                });
                this.loading = false;
            }
        });
    }

    formatDate(dateTime: string): string {
        if (!dateTime) return 'N/A';
        const date = new Date(dateTime);
        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}
