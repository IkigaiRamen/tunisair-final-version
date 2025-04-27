import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { OrderListModule } from 'primeng/orderlist';
import { PickListModule } from 'primeng/picklist';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { Meeting } from '../../core/models/meeting.model';
import { MeetingsService } from '../../core/services/meetings.service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
    selector: 'app-upcoming-meeting',
    standalone: true,
    imports: [CommonModule, DataViewModule, FormsModule, SelectButtonModule, PickListModule, OrderListModule, TagModule, ButtonModule, RouterModule],
    template: `
    <div class="flex flex-col">
        <div class="card">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold">Upcoming Meetings</h2>
                <div class="flex gap-2">
                    <p-select-button [(ngModel)]="layout" [options]="options" [allowEmpty]="false"
                                   styleClass="p-button-sm">
                        <ng-template #item let-option>
                            <i class="pi" [ngClass]="{ 'pi-bars': option === 'list', 'pi-th-large': option === 'grid' }"></i>
                        </ng-template>
                    </p-select-button>
                </div>
            </div>

            <p-dataview [value]="meetings" [layout]="layout">
                <!-- List Layout -->
                <ng-template #list let-items>
                    <div class="flex flex-col">
                        <div *ngFor="let meeting of items; let i = index">
                            <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4 border-b border-surface-200 last:border-0"
                                 [ngClass]="{ 'bg-surface-50': i % 2 === 0 }">
                                <div class="flex flex-col md:flex-row justify-between flex-1 gap-6">
                                    <div class="flex flex-col">
                                        <div class="text-lg font-semibold text-surface-900">{{ meeting.title }}</div>
                                        <div class="text-sm text-surface-600 mt-1">
                                            <i class="pi pi-calendar mr-2"></i>
                                            {{ meeting.dateTime | date:'medium' }}
                                        </div>
                                        <div class="text-sm mt-2">
                                            <i class="pi pi-user mr-2"></i>
                                            <span class="font-medium">Created By:</span> {{ meeting.createdBy.fullName }}
                                        </div>
                                        <div class="text-sm mt-2" *ngIf="meeting.agenda">
                                            <i class="pi pi-list mr-2"></i>
                                            <span class="font-medium">Agenda:</span> {{ meeting.agenda }}
                                        </div>
                                    </div>
                                    <div class="flex flex-col justify-center">
                                        <p-button icon="pi pi-eye" label="View Details" 
                                                  styleClass="p-button-outlined p-button-sm" 
                                                  [routerLink]="['/meetings', meeting.id]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ng-template>

                <!-- Grid Layout -->
                <ng-template #grid let-items>
                    <div class="grid grid-cols-12 gap-4">
                        <div *ngFor="let meeting of items" class="col-span-12 sm:col-span-6 lg:col-span-4">
                            <div class="p-6 border border-surface-200 bg-surface-0 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div class="flex flex-col gap-4">
                                    <div>
                                        <div class="text-lg font-semibold text-surface-900">{{ meeting.title }}</div>
                                        <div class="text-sm text-surface-600 mt-2">
                                            <i class="pi pi-calendar mr-2"></i>
                                            {{ meeting.dateTime | date:'medium' }}
                                        </div>
                                        <div class="text-sm mt-2">
                                            <i class="pi pi-user mr-2"></i>
                                            <span class="font-medium">Created By:</span> {{ meeting.createdBy.fullName }}
                                        </div>
                                        <div class="text-sm mt-2" *ngIf="meeting.objectives">
                                            <i class="pi pi-list mr-2"></i>
                                            <span class="font-medium">Objectives:</span> {{ meeting.objectives }}
                                        </div>
                                    </div>
                                    <div class="flex justify-end mt-4">
                                        <p-button icon="pi pi-eye" label="View Details" 
                                                  styleClass="p-button-outlined p-button-sm w-full" 
                                                  [routerLink]="['/meetings', meeting.id]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ng-template>
            </p-dataview>
        </div>
    </div>
    `,
    styles: [`
        :host ::ng-deep {
            .p-dataview {
                .p-dataview-content {
                    background: transparent;
                }
            }
            .p-selectbutton {
                .p-button {
                    padding: 0.5rem;
                }
            }
        }
    `],
    providers: [MeetingsService, AuthService]
})
export class upcomingMeetings implements OnInit {
    layout: 'list' | 'grid' = 'list';
    options = ['list', 'grid'];
    meetings: Meeting[] = [];
    currentUser: User | null = null;

    constructor(
        private meetingsService: MeetingsService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.currentUser = this.authService.getUser();
        if (this.currentUser) {
            const start = new Date().toISOString();    
            this.meetingsService.getUpcomingMeetings(start).subscribe(
                (meetings: Meeting[]) => {
                    // Filter meetings where the current user is a participant
                    this.meetings = meetings.filter(meeting => 
                        meeting.participants.some(participant => participant.id === this.currentUser?.id)
                    );
                },
                (error: any) => {
                    console.error('Error fetching upcoming meetings:', error);
                }
            );
        }
    }
}