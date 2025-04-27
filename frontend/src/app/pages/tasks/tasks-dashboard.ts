import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Task } from '../../core/models/task.model';
import { User } from '../../core/models/user.model';
import { TasksService } from '../../core/services/tasks.service';
import { UsersService } from '../../core/services/users.service';
import { RouterModule } from '@angular/router';
import { Decision } from '../../core/models/decision.model';
import { DropdownModule } from 'primeng/dropdown';
@Component({
    selector: 'app-tasks-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CardModule,
        TagModule,
        DialogModule,
        CalendarModule,
        MultiSelectModule,
        ToastModule,
        RouterModule,
        DropdownModule
    ],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <div class="col-span-full">
                <div class="card">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold">Tasks Dashboard</h2>
                        <div class="flex gap-2">
                            <p-button icon="pi pi-plus" label="New Task" (onClick)="openNew()" />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <!-- Pending Tasks -->
                        <div class="flex flex-col gap-4">
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg font-semibold">Pending</h3>
                                <p-tag [value]="getTasksByStatus('PENDING').length.toString()" severity="warn" />
                            </div>
                            <div class="flex flex-col gap-2">
                                <div *ngFor="let task of getTasksByStatus('PENDING')" 
                                     class="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                                    <div class="flex flex-col gap-2">
                                        <div class="font-medium">{{ task.description }}</div>
                                        <div class="text-sm text-surface-600">
                                            <i class="pi pi-calendar mr-2"></i>
                                            {{ task.deadline | date:'medium' }}
                                        </div>
                                        <div class="text-sm">
                                            <i class="pi pi-user mr-2"></i>
                                            {{ task.assignedTo.fullName }}
                                        </div>
                                        <div class="flex justify-end gap-2 mt-2">
                                            <p-button icon="pi pi-pencil" class="p-button-sm" [rounded]="true" [outlined]="true" 
                                                      (onClick)="editTask(task)" />
                                            <p-button icon="pi pi-trash" severity="danger" class="p-button-sm" [rounded]="true" [outlined]="true" 
                                                      (onClick)="deleteTask(task)" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- In Progress Tasks -->
                        <div class="flex flex-col gap-4">
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg font-semibold">In Progress</h3>
                                <p-tag [value]="getTasksByStatus('IN_PROGRESS').length.toString()" severity="info" />
                            </div>
                            <div class="flex flex-col gap-2">
                                <div *ngFor="let task of getTasksByStatus('IN_PROGRESS')" 
                                     class="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                                    <div class="flex flex-col gap-2">
                                        <div class="font-medium">{{ task.description }}</div>
                                        <div class="text-sm text-surface-600">
                                            <i class="pi pi-calendar mr-2"></i>
                                            {{ task.deadline | date:'medium' }}
                                        </div>
                                        <div class="text-sm">
                                            <i class="pi pi-user mr-2"></i>
                                            {{ task.assignedTo.fullName }}
                                        </div>
                                        <div class="flex justify-end gap-2 mt-2">
                                            <p-button icon="pi pi-pencil" class="p-button-sm" [rounded]="true" [outlined]="true" 
                                                      (onClick)="editTask(task)" />
                                            <p-button icon="pi pi-trash" severity="danger" class="p-button-sm" [rounded]="true" [outlined]="true" 
                                                      (onClick)="deleteTask(task)" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Completed Tasks -->
                        <div class="flex flex-col gap-4">
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg font-semibold">Completed</h3>
                                <p-tag [value]="getTasksByStatus('COMPLETED').length.toString()" severity="success" />
                            </div>
                            <div class="flex flex-col gap-2">
                                <div *ngFor="let task of getTasksByStatus('COMPLETED')" 
                                     class="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                                    <div class="flex flex-col gap-2">
                                        <div class="font-medium">{{ task.description }}</div>
                                        <div class="text-sm text-surface-600">
                                            <i class="pi pi-calendar mr-2"></i>
                                            {{ task.deadline | date:'medium' }}
                                        </div>
                                        <div class="text-sm">
                                            <i class="pi pi-user mr-2"></i>
                                            {{ task.assignedTo.fullName }}
                                        </div>
                                        <div class="flex justify-end gap-2 mt-2">
                                            <p-button icon="pi pi-pencil" class="p-button-sm" [rounded]="true" [outlined]="true" 
                                                      (onClick)="editTask(task)" />
                                            <p-button icon="pi pi-trash" severity="danger" class="p-button-sm" [rounded]="true" [outlined]="true" 
                                                      (onClick)="deleteTask(task)" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <p-dialog [(visible)]="taskDialog" [style]="{width: '600px'}" header="Task Details" [modal]="true" 
                  [draggable]="false" [resizable]="false" styleClass="p-fluid">
            <div class="flex flex-col gap-6">
                <div class="field">
                    <label for="description" class="block font-bold mb-2">Description</label>
                    <textarea pInputText id="description" [(ngModel)]="task.description" rows="3" 
                              placeholder="Enter task description..." class="w-full"></textarea>
                </div>

                <div class="field">
                    <label for="status" class="block font-bold mb-2">Status</label>
                    <p-dropdown [options]="taskStatuses" [(ngModel)]="task.status" 
                              optionLabel="name" optionValue="value"
                              placeholder="Select status" styleClass="w-full" />
                </div>

                <div class="field">
                    <label for="assignedTo" class="block font-bold mb-2">Assigned To</label>
                    <p-multiSelect [options]="userList" [(ngModel)]="task.assignedTo" 
                                 optionLabel="fullName" placeholder="Select user"
                                 styleClass="w-full" />
                </div>
 
                <div class="field">
                    <label for="deadline" class="block font-bold mb-2">Deadline</label>
                    <p-calendar [(ngModel)]="task.deadline" [showTime]="true" dateFormat="yy-mm-dd" 
                               [showIcon]="true" styleClass="w-full" />
                </div>
            </div>
            <ng-template pTemplate="footer">
                <div class="flex justify-end gap-2">
                    <p-button label="Cancel" icon="pi pi-times" (onClick)="hideDialog()" />
                    <p-button label="Save" icon="pi pi-check" (onClick)="saveTask()" />
                </div>
            </ng-template>
        </p-dialog>
    `,
    providers: [MessageService, TasksService, UsersService]
})
export class TasksDashboardComponent implements OnInit {
    tasks: Task[] = [];
    userList: User[] = [];
    taskDialog: boolean = false;
    task: Task = {} as Task;

    taskStatuses = [
        { name: 'Pending', value: 'PENDING' },
        { name: 'In Progress', value: 'IN_PROGRESS' },
        { name: 'Completed', value: 'COMPLETED' }
    ];

    constructor(
        private tasksService: TasksService,
        private usersService: UsersService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.loadTasks();
        this.loadUsers();
    }

    loadTasks() {
        this.tasksService.list().subscribe({
            next: (tasks) => {
                this.tasks = tasks;
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load tasks'
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

    getTasksByStatus(status: string): Task[] {
        return this.tasks.filter(task => task.status === status);
    }

    openNew() {
        this.task = {
            id: 0,
            description: '',
            status: 'PENDING',
            decision: {} as Decision,
            assignedTo: {} as User,
            deadline: new Date().toISOString()
        };
        this.taskDialog = true;
    }

    editTask(task: Task) {
        this.task = { ...task };
        this.taskDialog = true;
    }

    hideDialog() {
        this.taskDialog = false;
    }

    saveTask() {
        if (this.task.id) {
            this.tasksService.update(this.task.id, this.task).subscribe({
                next: (updatedTask) => {
                    const index = this.tasks.findIndex(t => t.id === updatedTask.id);
                    if (index !== -1) {
                        this.tasks[index] = updatedTask;
                    }
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Task updated successfully'
                    });
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to update task'
                    });
                }
            });
        } else {
            this.tasksService.create(this.task).subscribe({
                next: (newTask) => {
                    this.tasks.push(newTask);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Task created successfully'
                    });
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to create task'
                    });
                }
            });
        }
        this.taskDialog = false;
    }

    deleteTask(task: Task) {
        this.tasksService.delete(task.id).subscribe({
            next: () => {
                this.tasks = this.tasks.filter(t => t.id !== task.id);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Task deleted successfully'
                });
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete task'
                });
            }
        });
    }
} 