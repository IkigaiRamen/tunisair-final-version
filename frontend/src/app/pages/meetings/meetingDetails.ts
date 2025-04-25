import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { Meeting } from '../../core/models/meeting.model';
import { Decision } from '../../core/models/decision.model';
import { Task } from '../../core/models/task.model';
import { User } from '../../core/models/user.model';
import { Document } from '../../core/models/document.model';
import { MeetingsService } from '../../core/services/meetings.service';
import { DecisionsService } from '../../core/services/decisions.service';
import { TasksService } from '../../core/services/tasks.service';
import { UsersService } from '../../core/services/users.service';
import { DocumentsService } from '../../core/services/documents.service';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'app-meeting-details',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CardModule,
        TabViewModule,
        TableModule,
        TagModule,
        DialogModule,
        InputTextModule,
        TextareaModule,
        CalendarModule,
        MultiSelectModule,
        ToastModule,
        FileUploadModule,
        SelectModule
    ],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <div class="col-span-full">
                <div class="card">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-2xl font-bold">{{ meeting?.title }}</h2>
                        <div class="flex gap-2">
                            <p-button icon="pi pi-pencil" label="Edit" (onClick)="editMeeting()" />
                            <p-button icon="pi pi-trash" severity="danger" label="Delete" (onClick)="deleteMeeting()" />
                        </div>
                    </div>

                    <p-tabView>
                        <!-- Meeting Details Tab -->
                        <p-tabPanel header="Meeting Details">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="p-4 border rounded">
                                    <h3 class="text-xl font-semibold mb-4">Basic Information</h3>
                                    <div class="space-y-4">
                                        <div>
                                            <label class="font-bold">Date & Time:</label>
                                            <p>{{ meeting?.dateTime | date:'medium' }}</p>
                                        </div>
                                        <div>
                                            <label class="font-bold">Created By:</label>
                                            <p>{{ meeting?.createdBy?.fullName }}</p>
                                        </div>
                                        <div>
                                            <label class="font-bold">Agenda:</label>
                                            <p>{{ meeting?.agenda }}</p>
                                        </div>
                                        <div>
                                            <label class="font-bold">Objectives:</label>
                                            <p>{{ meeting?.objectives }}</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="p-4 border rounded">
                                    <h3 class="text-xl font-semibold mb-4">Participants</h3>
                                    <div class="flex flex-wrap gap-2">
                                        <p-tag *ngFor="let participant of meeting?.participants" 
                                               [value]="participant.fullName" 
                                               severity="info" />
                                    </div>
                                </div>
                            </div>
                        </p-tabPanel>

                        <!-- Documents Tab -->
                        <p-tabPanel header="Documents">
                            <div class="mb-4">
                                <p-fileupload #fu mode="advanced" [multiple]="true" accept="*/*" maxFileSize="10000000"
                                            [customUpload]="true" (uploadHandler)="uploadDocument($event)"
                                            chooseLabel="Choose Files" uploadLabel="Upload" cancelLabel="Cancel"
                                            [showUploadButton]="true" [showCancelButton]="true">
                                    <ng-template #empty>
                                        <div class="flex align-items-center justify-content-center">
                                            <i class="pi pi-file mr-2"></i>
                                            <span>Drag and drop files to here to upload.</span>
                                        </div>
                                    </ng-template>
                                </p-fileupload>
                            </div>

                            <p-table [value]="documents" [paginator]="true" [rows]="10" [showCurrentPageReport]="true"
                                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} documents"
                                    [rowsPerPageOptions]="[10,25,50]">
                                <ng-template pTemplate="header">
                                    <tr>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Size</th>
                                        <th>Uploaded By</th>
                                        <th>Upload Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </ng-template>
                                <ng-template pTemplate="body" let-document>
                                    <tr>
                                        <td>{{ document.name }}</td>
                                        <td>{{ document.type }}</td>
                                        <td>{{ document.size }}</td>
                                        <td>{{ document.uploadedBy?.fullName }}</td>
                                        <td>{{ document.createdAt | date:'medium' }}</td>
                                        <td>
                                            <p-button icon="pi pi-download" [rounded]="true" [outlined]="true" 
                                                      (onClick)="downloadDocument(document)" />
                                            <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" 
                                                      (onClick)="deleteDocument(document)" />
                                        </td>
                                    </tr>
                                </ng-template>
                            </p-table>
                        </p-tabPanel>

                        <!-- Decisions Tab -->
                        <p-tabPanel header="Decisions">
                            <div class="mb-4">
                                <p-button icon="pi pi-plus" label="Add Decision" (onClick)="openNewDecision()" />
                            </div>
                            <p-table [value]="decisions" [paginator]="true" [rows]="10" [showCurrentPageReport]="true"
                                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} decisions"
                                    [rowsPerPageOptions]="[10,25,50]">
                                <ng-template pTemplate="header">
                                    <tr>
                                        <th>Content</th>
                                        <th>Responsible</th>
                                        <th>Deadline</th>
                                        <th>Actions</th>
                                    </tr>
                                </ng-template>
                                <ng-template pTemplate="body" let-decision>
                                    <tr>
                                        <td>{{ decision.content }}</td>
                                        <td>{{ decision.responsibleUser?.fullName }}</td>
                                        <td>{{ decision.deadline | date:'medium' }}</td>
                                        <td>
                                            <p-button icon="pi pi-pencil" [rounded]="true" [outlined]="true" 
                                                      (onClick)="editDecision(decision)" />
                                            <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" 
                                                      (onClick)="deleteDecision(decision)" />
                                        </td>
                                    </tr>
                                </ng-template>
                            </p-table>
                        </p-tabPanel>

                        <!-- Tasks Tab -->
                        <p-tabPanel header="Tasks">
                            <div class="mb-4">
                                <p-button icon="pi pi-plus" label="Add Task" (onClick)="openNewTask()" />
                            </div>
                            <p-table [value]="tasks" [paginator]="true" [rows]="10" [showCurrentPageReport]="true"
                                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} tasks"
                                    [rowsPerPageOptions]="[10,25,50]">
                                <ng-template pTemplate="header">
                                    <tr>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Assigned To</th>
                                        <th>Deadline</th>
                                        <th>Actions</th>
                                    </tr>
                                </ng-template>
                                <ng-template pTemplate="body" let-task>
                                    <tr>
                                        <td>{{ task.description }}</td>
                                        <td>
                                            <p-tag [value]="task.status" 
                                                  [severity]="getTaskStatusSeverity(task.status)" />
                                        </td>
                                        <td>{{ task.assignedTo?.fullName }}</td>
                                        <td>{{ task.deadline | date:'medium' }}</td>
                                        <td>
                                            <p-button icon="pi pi-pencil" [rounded]="true" [outlined]="true" 
                                                      (onClick)="editTask(task)" />
                                            <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" 
                                                      (onClick)="deleteTask(task)" />
                                        </td>
                                    </tr>
                                </ng-template>
                            </p-table>
                        </p-tabPanel>
                    </p-tabView>
                </div>
            </div>
        </div>

        <!-- Decision Dialog -->
        <p-dialog [(visible)]="decisionDialog" [style]="{width: '450px'}" header="Decision Details" [modal]="true">
            <div class="flex flex-col gap-4">
                <div>
                    <label for="content" class="block font-bold mb-2">Content</label>
                    <textarea pTextarea id="content" [(ngModel)]="decision.content" rows="3" class="w-full"></textarea>
                </div>
                <div>
                    <label for="responsibleUser" class="block font-bold mb-2">Responsible User</label>
                    <p-multiSelect [options]="userList" [(ngModel)]="decision.responsibleUser" 
                                 optionLabel="fullName" placeholder="Select User" />
                </div>
                <div>
                    <label for="deadline" class="block font-bold mb-2">Deadline</label>
                    <p-calendar [(ngModel)]="decision.deadline" [showTime]="true" dateFormat="yy-mm-dd" />
                </div>
            </div>
            <ng-template pTemplate="footer">
                <p-button label="Cancel" icon="pi pi-times" (onClick)="hideDecisionDialog()" />
                <p-button label="Save" icon="pi pi-check" (onClick)="saveDecision()" />
            </ng-template>
        </p-dialog>

        <!-- Task Dialog -->
        <p-dialog [(visible)]="taskDialog" [style]="{width: '450px'}" header="Task Details" [modal]="true">
            <div class="flex flex-col gap-4">
                <div>
                    <label for="description" class="block font-bold mb-2">Description</label>
                    <textarea pTextarea id="description" [(ngModel)]="task.description" rows="3" class="w-full"></textarea>
                </div>
                <div>
                    <label for="status" class="block font-bold mb-2">Status</label>
                    <p-select [(ngModel)]="task.status" [options]="taskStatuses" optionLabel="name" optionValue="value" />
                </div>
                <div>
                    <label for="assignedTo" class="block font-bold mb-2">Assigned To</label>
                    <p-multiSelect [options]="userList" [(ngModel)]="task.assignedTo" 
                                 optionLabel="fullName" placeholder="Select User" />
                </div>
                <div>
                    <label for="deadline" class="block font-bold mb-2">Deadline</label>
                    <p-calendar [(ngModel)]="task.deadline" [showTime]="true" dateFormat="yy-mm-dd" />
                </div>
            </div>
            <ng-template pTemplate="footer">
                <p-button label="Cancel" icon="pi pi-times" (onClick)="hideTaskDialog()" />
                <p-button label="Save" icon="pi pi-check" (onClick)="saveTask()" />
            </ng-template>
        </p-dialog>

        <p-toast></p-toast>
    `,
    providers: [MessageService, MeetingsService, DecisionsService, TasksService, UsersService, DocumentsService]
})
export class MeetingDetailsComponent implements OnInit {
    meeting: Meeting | null = null;
    decisions: Decision[] = [];
    tasks: Task[] = [];
    documents: Document[] = [];
    userList: User[] = [];

    // Dialog states
    decisionDialog: boolean = false;
    taskDialog: boolean = false;

    // Form objects
    decision: Decision = {} as Decision;
    task: Task = {} as Task;

    // Task status options
    taskStatuses = [
        { name: 'Pending', value: 'PENDING' },
        { name: 'In Progress', value: 'IN_PROGRESS' },
        { name: 'Completed', value: 'COMPLETED' }
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private meetingsService: MeetingsService,
        private decisionsService: DecisionsService,
        private tasksService: TasksService,
        private usersService: UsersService,
        private documentsService: DocumentsService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        const meetingId = this.route.snapshot.params['id'];
        if (meetingId) {
            this.loadMeetingDetails(meetingId);
            this.loadDecisions(meetingId);
            this.loadDocuments(meetingId);
            this.loadUsers();
        }
    }

    loadMeetingDetails(id: number) {
        this.meetingsService.detail(id).subscribe({
            next: (meeting) => {
                this.meeting = meeting;
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load meeting details'
                });
            }
        });
    }

    loadDecisions(meetingId: number) {
        this.decisionsService.list(meetingId).subscribe({
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

    loadDocuments(meetingId: number) {
        this.documentsService.list(meetingId).subscribe({
            next: (documents) => {
                this.documents = documents;
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load documents'
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

    // Document methods
    uploadDocument(event: any) {
        const formData = new FormData();
        for (const file of event.files) {
            formData.append('file', file);
        }
        formData.append('meetingId', this.meeting?.id.toString() || '');

        this.documentsService.upload(formData).subscribe({
            next: (document) => {
                this.documents.push(document);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Document uploaded successfully'
                });
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to upload document'
                });
            }
        });
    }

    downloadDocument(doc: Document) {
        this.documentsService.download(doc.id).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = doc.name;
                link.click();
                window.URL.revokeObjectURL(url);
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to download document'
                });
            }
        });
    }

    deleteDocument(document: Document) {
        this.documentsService.delete(document.id).subscribe({
            next: () => {
                this.documents = this.documents.filter(d => d.id !== document.id);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Document deleted successfully'
                });
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete document'
                });
            }
        });
    }

    // Decision methods
    openNewDecision() {
        this.decision = {
            id: 0,
            content: '',
            meeting: this.meeting!,
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

    hideDecisionDialog() {
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

    // Task methods
    openNewTask() {
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

    hideTaskDialog() {
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

    // Helper methods
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

    editMeeting() {
        // Navigate to edit meeting page
        this.router.navigate(['/meetings/edit', this.meeting?.id]);
    }

    deleteMeeting() {
        if (this.meeting) {
            this.meetingsService.delete(this.meeting.id).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Meeting deleted successfully'
                    });
                    this.router.navigate(['/meetings']);
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete meeting'
                    });
                }
            });
        }
    }
}
