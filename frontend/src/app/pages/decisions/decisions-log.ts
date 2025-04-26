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
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';
import { Decision } from '../../core/models/decision.model';
import { Task } from '../../core/models/task.model';
import { User } from '../../core/models/user.model';
import { DecisionsService } from '../../core/services/decisions.service';
import { TasksService } from '../../core/services/tasks.service';
import { UsersService } from '../../core/services/users.service';
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { AuthService } from '../../core/services/auth.service';
@Component({
    selector: 'app-decisions-log',
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
        DialogModule,
        CalendarModule,
        MultiSelectModule,
        RouterModule,
        DropdownModule
    ],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <div class="col-span-full">
                <div class="card">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold">Decisions Log</h2>
                        <div class="flex gap-2">
                            <p-button icon="pi pi-plus" label="New Decision" (onClick)="openNew()" *ngIf="userRole !== 'ROLE_BOARD_MEMBER'" />
                        </div>
                    </div>

                    <p-table [value]="decisions" [paginator]="true" [rows]="10" [showCurrentPageReport]="true"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} decisions"
                            [rowsPerPageOptions]="[10,25,50]" [globalFilterFields]="['content','meeting.title']"
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
                                <th pSortableColumn="responsibleUser">Responsible <p-sortIcon field="responsibleUser" /></th>
                                <th pSortableColumn="deadline">Deadline <p-sortIcon field="deadline" /></th>
                                <th pSortableColumn="tasks">Tasks <p-sortIcon field="tasks" /></th>
                                <th *ngIf="userRole !== 'ROLE_BOARD_MEMBER'">Actions</th>
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
                                <td>{{ decision.responsibleUser?.fullName }}</td>
                                <td>{{ decision.deadline | date:'medium' }}</td>
                                <td>
                                    <div class="flex flex-wrap gap-1">
                                        <p-tag *ngFor="let task of decision.tasks" 
                                               [value]="task.status" 
                                               [severity]="getTaskStatusSeverity(task.status)" />
                                    </div>
                                </td>
                                <td *ngIf="userRole !== 'ROLE_BOARD_MEMBER'">
                                    <div class="flex gap-2">
                                        <p-button icon="pi pi-pencil" class="p-button-sm" [rounded]="true" [outlined]="true" 
                                                  (onClick)="editDecision(decision)" />
                                        <p-button icon="pi pi-trash" severity="danger" class="p-button-sm" [rounded]="true" [outlined]="true" 
                                                  (onClick)="deleteDecision(decision)" />
                                    </div>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>
        </div>

        <p-dialog [(visible)]="decisionDialog" [style]="{width: '600px'}" header="Decision Details" [modal]="true" 
                  [draggable]="false" [resizable]="false" styleClass="p-fluid">
            <div class="flex flex-col gap-6">
                <div class="field">
                    <label for="content" class="block font-bold mb-2">Decision Content</label>
                    <textarea pInputText id="content" [(ngModel)]="decision.content" rows="3" 
                              placeholder="Enter decision content..." class="w-full"></textarea>
                </div>

                <div class="field">
                    <label for="meeting" class="block font-bold mb-2">Meeting</label>
                    <p-dropdown [options]="meetings" [(ngModel)]="decision.meeting" 
                              optionLabel="title" placeholder="Select a meeting"
                              styleClass="w-full" />
                </div>

                <div class="field">
                    <label for="responsibleUser" class="block font-bold mb-2">Responsible User</label>
                    <p-multiSelect [options]="userList" [(ngModel)]="decision.responsibleUser" 
                                 optionLabel="fullName" placeholder="Select responsible user"
                                 styleClass="w-full" />
                </div>

                <div class="field">
                    <label for="deadline" class="block font-bold mb-2">Deadline</label>
                    <p-calendar [(ngModel)]="decision.deadline" [showTime]="true" dateFormat="yy-mm-dd" 
                               [showIcon]="true" styleClass="w-full" />
                </div>

                <div class="field">
                    <label class="block font-bold mb-2">Associated Tasks</label>
                    <div class="flex flex-col gap-2">
                        <div *ngFor="let task of decision.tasks" class="flex items-center gap-2 p-2 border rounded">
                            <span class="flex-1">{{ task.description }}</span>
                            <p-tag [value]="task.status" [severity]="getTaskStatusSeverity(task.status)" />
                        </div>
                    </div>
                </div>
            </div>
            <ng-template pTemplate="footer">
                <div class="flex justify-end gap-2">
                    <p-button label="Cancel" icon="pi pi-times" (onClick)="hideDialog()" />
                    <p-button label="Save" icon="pi pi-check" (onClick)="saveDecision()" />
                </div>
            </ng-template>
        </p-dialog>
    `,
    providers: [MessageService, DecisionsService, TasksService, UsersService]
})
export class DecisionsLogComponent implements OnInit {
    decisions: Decision[] = [];
    meetings: any[] = [];
    userList: User[] = [];
    decisionDialog: boolean = false;
    decision: Decision = {} as Decision;
    userRole: string = '';

    constructor(
        private decisionsService: DecisionsService,
        private tasksService: TasksService,
        private usersService: UsersService,
        private messageService: MessageService,
        private authService: AuthService
    ) {}

        ngOnInit() {
        this.authService.me().subscribe({
            next: (user: User) => {
                this.userRole = user.roles[0].name;
            },
            error: (error: any) => {
                console.error('Error fetching current user', error);
            }
        });
        this.loadDecisions();
        this.loadUsers();
    }

    loadDecisions() {
        this.decisionsService.list().subscribe({
            next: (decisions) => {
                this.decisions = decisions;
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

    loadUsers() {
        this.usersService.getAll().subscribe({
            next: (users) => {
                this.userList = users;
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load users'
                });
            }
        });
    }

    onGlobalFilter(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        // Implement filtering logic
    }

    openNew() {
        this.decision = {
            id: 0,
            content: '',
            meeting: {} as any,
            responsibleUser: {} as User,
            deadline: new Date().toISOString(),
            tasks: []
        };
        this.decisionDialog = true;
    }

    editDecision(decision: Decision) {
        this.decision = { ...decision };
        this.decisionDialog = true;
    }

    hideDialog() {
        this.decisionDialog = false;
    }

    saveDecision() {
        if (this.decision.id) {
            this.decisionsService.update(this.decision.id, this.decision).subscribe({
                next: (updatedDecision) => {
                    const index = this.decisions.findIndex(d => d.id === updatedDecision.id);
                    if (index !== -1) {
                        this.decisions[index] = updatedDecision;
                    }
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Decision updated successfully'
                    });
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to update decision'
                    });
                }
            });
        } else {
            this.decisionsService.create(this.decision).subscribe({
                next: (newDecision) => {
                    this.decisions.push(newDecision);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Decision created successfully'
                    });
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to create decision'
                    });
                }
            });
        }
        this.decisionDialog = false;
    }

    deleteDecision(decision: Decision) {
        this.decisionsService.delete(decision.id).subscribe({
            next: () => {
                this.decisions = this.decisions.filter(d => d.id !== decision.id);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Decision deleted successfully'
                });
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete decision'
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