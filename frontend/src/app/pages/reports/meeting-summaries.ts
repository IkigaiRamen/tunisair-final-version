import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { Meeting } from '../../core/models/meeting.model';
import { MeetingsService } from '../../core/services/meetings.service';
import { ReportService } from '../../core/services/report.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-meeting-summaries',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        TableModule,
        TagModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        ToastModule,
        CalendarModule,
        RouterModule
    ],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <div class="col-span-full">
                <div class="card">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold">Meeting Summaries</h2>
                        <div class="flex gap-2">
                            <p-button icon="pi pi-download" label="Export PDF" (onClick)="exportPDF()" />
                            <p-button icon="pi pi-download" label="Export Excel" (onClick)="exportExcel()" />
                        </div>
                    </div>

                    <div class="mb-6">
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="field">
                                <label for="startDate" class="block font-bold mb-2">Start Date</label>
                                <p-calendar [(ngModel)]="startDate" [showIcon]="true" dateFormat="yy-mm-dd" 
                                           styleClass="w-full" />
                            </div>
                            <div class="field">
                                <label for="endDate" class="block font-bold mb-2">End Date</label>
                                <p-calendar [(ngModel)]="endDate" [showIcon]="true" dateFormat="yy-mm-dd" 
                                           styleClass="w-full" />
                            </div>
                            <div class="field flex items-end">
                                <p-button label="Filter" icon="pi pi-filter" (onClick)="filterMeetings()" />
                            </div>
                        </div>
                    </div>

                    <p-table [value]="meetings" [paginator]="true" [rows]="10" [showCurrentPageReport]="true"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} meetings"
                            [rowsPerPageOptions]="[10,25,50]" [globalFilterFields]="['title','createdBy.fullName']"
                            styleClass="p-datatable-sm">
                        <ng-template #caption>
                            <div class="flex items-center justify-between">
                                <p-iconfield>
                                    <p-inputicon styleClass="pi pi-search" />
                                    <input pInputText type="text" (input)="onGlobalFilter($event)" 
                                           placeholder="Search meetings..." class="p-inputtext-sm" />
                                </p-iconfield>
                            </div>
                        </ng-template>
                        <ng-template #header>
                            <tr>
                                <th pSortableColumn="title">Title <p-sortIcon field="title" /></th>
                                <th pSortableColumn="dateTime">Date <p-sortIcon field="dateTime" /></th>
                                <th pSortableColumn="createdBy">Created By <p-sortIcon field="createdBy" /></th>
                                <th pSortableColumn="participants">Participants <p-sortIcon field="participants" /></th>
                                <th pSortableColumn="decisions">Decisions <p-sortIcon field="decisions" /></th>
                                <th pSortableColumn="tasks">Tasks <p-sortIcon field="tasks" /></th>
                                <th>Actions</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-meeting>
                            <tr>
                                <td class="font-medium">{{ meeting.title }}</td>
                                <td>{{ meeting.dateTime | date:'medium' }}</td>
                                <td>{{ meeting.createdBy?.fullName }}</td>
                                <td>
                                    <div class="flex flex-wrap gap-1">
                                        <p-tag *ngFor="let participant of meeting.participants" 
                                               [value]="participant.fullName" severity="info" />
                                    </div>
                                </td>
                                <td>
                                    <div class="flex flex-wrap gap-1">
                                        <p-tag *ngFor="let decision of meeting.decisions" 
                                               [value]="decision.content" severity="success" />
                                    </div>
                                </td>
                                <td>
                                    <div class="flex flex-wrap gap-1">
                                        <p-tag *ngFor="let task of meeting.tasks" 
                                               [value]="task.status" 
                                               [severity]="getTaskStatusSeverity(task.status)" />
                                    </div>
                                </td>
                                <td>
                                    <div class="flex gap-2">
                                        <p-button icon="pi pi-eye" class="p-button-sm" [rounded]="true" [outlined]="true" 
                                                  [routerLink]="['/meetings', meeting.id]" />
                                    </div>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>
        </div>
    `,
    providers: [MessageService, MeetingsService, ReportService]
})
export class MeetingSummariesComponent implements OnInit {
    meetings: Meeting[] = [];
    startDate: Date | null = null;
    endDate: Date | null = null;

    constructor(
        private meetingsService: MeetingsService,
        private reportService: ReportService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.loadMeetings();
    }

    loadMeetings() {
        this.meetingsService.list().subscribe({
            next: (meetings) => {
                this.meetings = meetings;
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load meetings'
                });
            }
        });
    }

    filterMeetings() {
        if (this.startDate && this.endDate) {
            // Implement date filtering logic
        }
    }

    onGlobalFilter(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        // Implement filtering logic
    }

    exportPDF() {
        this.reportService.generate('pdf').subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'meeting-summaries.pdf';
                link.click();
                window.URL.revokeObjectURL(url);
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to generate PDF report'
                });
            }
        });
    }

    exportExcel() {
        this.reportService.generate('excel').subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'meeting-summaries.xlsx';
                link.click();
                window.URL.revokeObjectURL(url);
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to generate Excel report'
                });
            }
        });
    }

    getTaskStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' {
        switch (status) {
            case 'PENDING':
                return 'warn';
            case 'IN_PROGRESS':
                return 'info';
            case 'COMPLETED':
                return 'success';
            default:
                return 'info';
        }
    }
} 