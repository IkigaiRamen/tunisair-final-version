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
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { Decision } from '../../core/models/decision.model';
import { Task } from '../../core/models/task.model';
import { DecisionsService } from '../../core/services/decisions.service';
import { TasksService } from '../../core/services/tasks.service';
import { AuthService } from '../../core/services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-my-decisions-tasks',
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
        RouterModule,
        DropdownModule,
        ToastModule
    ],
    template: `
        <div class="grid grid-cols-1 gap-8">
            <!-- Decisions Section -->
            <div class="col-span-1">
                <div class="card">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold">My Decisions</h2>
                        <div class="flex gap-2">
                            <p-button icon="pi pi-filter" label="Filter" (onClick)="filterDecisions()" />
                            <p-button icon="pi pi-times" label="Clear" severity="secondary" (onClick)="clearFilters()" />
                        </div>
                    </div>

                    <div class="mb-6">
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="field">
                                <label for="startDate" class="block font-bold mb-2">Start Date</label>
                                <p-calendar [(ngModel)]="startDate" [showIcon]="true" dateFormat="yy-mm-dd" 
                                           [showButtonBar]="true" [showTime]="false" [readonlyInput]="true"
                                           styleClass="w-full" />
                            </div>
                            <div class="field">
                                <label for="endDate" class="block font-bold mb-2">End Date</label>
                                <p-calendar [(ngModel)]="endDate" [showIcon]="true" dateFormat="yy-mm-dd" 
                                           [showButtonBar]="true" [showTime]="false" [readonlyInput]="true"
                                           styleClass="w-full" />
                            </div>
                        </div>
                    </div>

                    <p-table [value]="filteredDecisions" [paginator]="true" [rows]="5" [showCurrentPageReport]="true"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} decisions"
                            [rowsPerPageOptions]="[5,10,25]" [globalFilterFields]="['content','meeting.title']"
                            styleClass="p-datatable-sm">
                        <ng-template #caption>
                            <div class="flex items-center justify-between">
                                <p-iconfield>
                                    <p-inputicon styleClass="pi pi-search" />
                                    <input pInputText type="text" (input)="onGlobalFilter($event)" 
                                           placeholder="Search decisions..." class="p-inputtext-sm" />
                                </p-iconfield>
                            </div>
                        </ng-template>
                        <ng-template #header>
                            <tr>
                                <th pSortableColumn="content">Decision <p-sortIcon field="content" /></th>
                                <th pSortableColumn="meeting.title">Meeting <p-sortIcon field="meeting.title" /></th>
                                <th pSortableColumn="deadline">Deadline <p-sortIcon field="deadline" /></th>
                                <th pSortableColumn="tasks">Tasks <p-sortIcon field="tasks" /></th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-decision>
                            <tr>
                                <td class="font-medium">{{ decision.content }}</td>
                                <td>
                                    <a [routerLink]="['/meetings', decision.meeting?.id]" 
                                       class="text-primary hover:underline">
                                        {{ decision.meeting?.title }}
                                    </a>
                                </td>
                                <td>{{ decision.deadline | date:'medium' }}</td>
                                <td>
                                    <div class="flex flex-wrap gap-1">
                                        <p-tag *ngFor="let task of decision.tasks" 
                                               [value]="task.status" 
                                               [severity]="getTaskStatusSeverity(task.status)" />
                                    </div>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>

            <!-- Tasks Section -->
            <div class="col-span-1">
                <div class="card">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold">My Tasks</h2>
                        <div class="flex gap-2">
                            <p-button icon="pi pi-filter" label="Filter" (onClick)="filterTasks()" />
                            <p-button icon="pi pi-times" label="Clear" severity="secondary" (onClick)="clearFilters()" />
                        </div>
                    </div>

                    <div class="mb-6">
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="field">
                                <label for="taskStartDate" class="block font-bold mb-2">Start Date</label>
                                <p-calendar [(ngModel)]="taskStartDate" [showIcon]="true" dateFormat="yy-mm-dd" 
                                           [showButtonBar]="true" [showTime]="false" [readonlyInput]="true"
                                           styleClass="w-full" />
                            </div>
                            <div class="field">
                                <label for="taskEndDate" class="block font-bold mb-2">End Date</label>
                                <p-calendar [(ngModel)]="taskEndDate" [showIcon]="true" dateFormat="yy-mm-dd" 
                                           [showButtonBar]="true" [showTime]="false" [readonlyInput]="true"
                                           styleClass="w-full" />
                            </div>
                        </div>
                    </div>

                    <p-table [value]="filteredTasks" [paginator]="true" [rows]="5" [showCurrentPageReport]="true"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} tasks"
                            [rowsPerPageOptions]="[5,10,25]" [globalFilterFields]="['description','decision.content']"
                            styleClass="p-datatable-sm">
                        <ng-template #caption>
                            <div class="flex items-center justify-between">
                                <p-iconfield>
                                    <p-inputicon styleClass="pi pi-search" />
                                    <input pInputText type="text" (input)="onGlobalFilter($event)" 
                                           placeholder="Search tasks..." class="p-inputtext-sm" />
                                </p-iconfield>
                            </div>
                        </ng-template>
                        <ng-template #header>
                            <tr>
                                <th pSortableColumn="description">Task <p-sortIcon field="description" /></th>
                                <th pSortableColumn="decision.content">Decision <p-sortIcon field="decision.content" /></th>
                                <th pSortableColumn="status">Status <p-sortIcon field="status" /></th>
                                <th pSortableColumn="deadline">Deadline <p-sortIcon field="deadline" /></th>
                                <th>Actions</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-task>
                            <tr>
                                <td class="font-medium">{{ task.description }}</td>
                                <td>{{ task.decision?.content }}</td>
                                <td>
                                    <p-tag [value]="task.status" 
                                           [severity]="getTaskStatusSeverity(task.status)" />
                                </td>
                                <td>{{ task.deadline | date:'medium' }}</td>
                                <td>
                                    <p-dropdown [options]="getStatusOptions(task)" 
                                               [(ngModel)]="task.status"
                                               (onChange)="updateTaskStatus(task)"
                                               [style]="{'min-width': '120px'}"
                                               appendTo="body"
                                               [autoDisplayFirst]="false"
                                               [scrollHeight]="'200px'"
                                               [disabled]="task.status === 'COMPLETED'"
                                               placeholder="Change Status">
                                    </p-dropdown>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>
        </div>
    `,
    providers: [MessageService, DecisionsService, TasksService]
})
export class MyDecisionsTasksComponent implements OnInit {
    decisions: Decision[] = [];
    filteredDecisions: Decision[] = [];
    tasks: Task[] = [];
    filteredTasks: Task[] = [];
    startDate: Date | null = null;
    endDate: Date | null = null;
    taskStartDate: Date | null = null;
    taskEndDate: Date | null = null;
    searchText: string = '';
    statusOptions = [
        { label: 'Pending', value: 'PENDING' },
        { label: 'In Progress', value: 'IN_PROGRESS' },
        { label: 'Completed', value: 'COMPLETED' }
    ];

    constructor(
        private decisionsService: DecisionsService,
        private tasksService: TasksService,
        private authService: AuthService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.loadUserData();
    }

    loadUserData() {
        const currentUser = this.authService.getUser();
        if (currentUser) {
            // Load user's decisions
            this.decisionsService.list().subscribe({
                next: (decisions) => {
                    this.decisions = decisions.filter(d => 
                        d.responsibleUser?.id === currentUser.id
                    );
                    this.filteredDecisions = [...this.decisions];
                    this.tasks = this.decisions.map(d => d.tasks).flat();
                    this.filteredTasks = [...this.tasks]; 
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load decisions'
                    });
                }
            });

        
        }
    }

    filterDecisions() {
        let filtered = [...this.decisions];

        if (this.startDate && this.endDate) {
            const start = new Date(this.startDate);
            const end = new Date(this.endDate);
            
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);

            filtered = filtered.filter(decision => {
                const decisionDate = new Date(decision.deadline);
                return decisionDate >= start && decisionDate <= end;
            });
        }

        if (this.searchText) {
            const searchLower = this.searchText.toLowerCase();
            filtered = filtered.filter(decision => 
                decision.content.toLowerCase().includes(searchLower) ||
                decision.meeting?.title?.toLowerCase().includes(searchLower)
            );
        }

        this.filteredDecisions = filtered;
    }

    filterTasks() {
        let filtered = [...this.tasks];

        if (this.taskStartDate && this.taskEndDate) {
            const start = new Date(this.taskStartDate);
            const end = new Date(this.taskEndDate);
            
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);

            filtered = filtered.filter(task => {
                const taskDate = new Date(task.deadline);
                return taskDate >= start && taskDate <= end;
            });
        }

        if (this.searchText) {
            const searchLower = this.searchText.toLowerCase();
            filtered = filtered.filter(task => 
                task.description.toLowerCase().includes(searchLower) ||
                task.decision?.content?.toLowerCase().includes(searchLower)
            );
        }

        this.filteredTasks = filtered;
    }

    clearFilters() {
        this.startDate = null;
        this.endDate = null;
        this.taskStartDate = null;
        this.taskEndDate = null;
        this.searchText = '';
        this.filteredDecisions = [...this.decisions];
        this.filteredTasks = [...this.tasks];
    }

    onGlobalFilter(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.searchText = value;
        this.filterDecisions();
        this.filterTasks();
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

    updateTaskStatus(task: Task) {
        this.tasksService.updateStatus(task.id, task.status).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Task status updated successfully'
                });
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to update task status'
                });
                // Revert the status change in case of error
                this.loadUserData();
            }
        });
    }

    getStatusOptions(task: Task) {
        if (task.status === 'IN_PROGRESS') {
            return [
                { label: 'In Progress', value: 'IN_PROGRESS' },
                { label: 'Completed', value: 'COMPLETED' }
            ];
        }
        return this.statusOptions;
    }
} 