import { Component, OnInit, ViewChild } from '@angular/core';
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
import { FileUploadModule, FileUpload } from 'primeng/fileupload';
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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { FileSizePipe } from '../../shared/file-size.pipe';
import { DropdownModule } from 'primeng/dropdown';
import { AuthService } from '../../core/services/auth.service';
import { ReportService } from '../../core/services/report.service';
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
        SelectModule,
        ConfirmDialogModule,
        FileSizePipe,
        DropdownModule
    ],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <div class="col-span-full">
                <div class="card">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-2xl font-bold">{{ meeting?.title }}</h2>
                        <p-button icon="pi pi-download" label="Download PDF" (onClick)="downloadPDF()" />
                        <p-button icon="pi pi-download" label="Download Excel" (onClick)="downloadExcel()" />
                        <div class="flex gap-2" *ngIf="userRole !== 'ROLE_BOARD_MEMBER'">
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
                                            <p>{{ meeting?.dateTime | date: 'medium' }}</p>
                                        </div>
                                        <div>
                                            <label class="font-bold">Virtual Meeting Link:</label>
                                            <div *ngIf="meeting?.virtualLink">
                                                <a [href]="meeting?.virtualLink" target="_blank" 
                                                   class="text-primary hover:underline flex items-center gap-2">
                                                    <i class="pi pi-external-link"></i>
                                                    Join Virtual Meeting
                                                </a>
                                            </div>
                                            <p *ngIf="!meeting?.virtualLink" class="text-gray-500">In-person meeting</p>
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
                                        <p-tag *ngFor="let participant of meeting?.participants" [value]="participant.fullName" severity="info" />
                                    </div>
                                </div>
                            </div>
                        </p-tabPanel>

                        <!-- Documents Tab -->
                        <p-tabPanel header="Documents">
                            <div class="mb-4">
                                <p-fileupload
                                    #fileUpload
                                    mode="advanced"
                                    [multiple]="true"
                                    accept="*/*"
                                    maxFileSize="10000000"
                                    [customUpload]="true"
                                    (uploadHandler)="uploadDocument($event)"
                                    (onSelect)="onFileSelect($event)"
                                    (onError)="onUploadError($event)"
                                    (onClear)="onClear()"
                                    chooseLabel="Choose Files"
                                    [auto]="true"
                                    [showUploadButton]="false"
                                    [showCancelButton]="true"
                                >
                                    <ng-template pTemplate="empty">
                                        <div class="flex align-items-center justify-content-center p-4">
                                            <i class="pi pi-file mr-2 text-2xl"></i>
                                            <span class="text-lg">Drag and drop files to here to upload.</span>
                                        </div>
                                    </ng-template>
                                    <ng-template pTemplate="content">
                                        <ul *ngIf="uploadedFiles.length" class="m-0 p-0 list-none">
                                            <li *ngFor="let file of uploadedFiles" class="flex items-center gap-2 p-2">
                                                <i class="pi pi-file text-xl"></i>
                                                <span>{{ file.name }} - {{ file.size | fileSize }}</span>
                                            </li>
                                        </ul>
                                    </ng-template>
                                </p-fileupload>
                            </div>

                            <p-table [value]="documents" [paginator]="true" [rows]="10" [showCurrentPageReport]="true" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} documents" [rowsPerPageOptions]="[10, 25, 50]">
                                <ng-template pTemplate="header">
                                    <tr>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Size</th>
                                        <th>Uploaded By</th>
                                        <th>Upload Date</th>
                                        <th *ngIf="userRole !== 'ROLE_BOARD_MEMBER'">Actions</th>
                                    </tr>
                                </ng-template>
                                <ng-template pTemplate="body" let-document>
                                    <tr>
                                        <td>{{ document.name }}</td>
                                        <td>
                                            <p-tag [value]="document.type" severity="info" />
                                        </td>
                                        <td>{{ document.size | fileSize }}</td>
                                        <td>{{ document.uploadedBy?.fullName }}</td>
                                        <td>{{ document.createdAt | date: 'medium' }}</td>
                                        <td>
                                            <div class="flex gap-2" *ngIf="userRole !== 'ROLE_BOARD_MEMBER'">
                                                <p-button icon="pi pi-download" class="p-button-sm" [rounded]="true" [outlined]="true" (onClick)="downloadDocument(document)" />
                                                <p-button icon="pi pi-trash" severity="danger" class="p-button-sm" [rounded]="true" [outlined]="true" (onClick)="confirmDeleteDocument(document)" />
                                            </div>
                                        </td>
                                    </tr>
                                </ng-template>
                                <ng-template pTemplate="emptymessage">
                                    <tr>
                                        <td colspan="6" class="text-center p-4">
                                            <div class="flex flex-column align-items-center justify-content-center">
                                                <i class="pi pi-file text-4xl text-gray-400 mb-2"></i>
                                                <span class="text-gray-500">No documents found</span>
                                            </div>
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
                            <p-table [value]="decisions" [paginator]="true" [rows]="10" [showCurrentPageReport]="true" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} decisions" [rowsPerPageOptions]="[10, 25, 50]">
                                <ng-template pTemplate="header">
                                    <tr>
                                        <th>Content</th>
                                        <th>Responsible</th>
                                        <th>Deadline</th>
                                        <th *ngIf="userRole !== 'ROLE_BOARD_MEMBER'">Actions</th>
                                    </tr>
                                </ng-template>
                                <ng-template pTemplate="body" let-decision>
                                    <tr>
                                        <td>{{ decision.content }}</td>
                                        <td>{{ decision.responsibleUser?.fullName }}</td>
                                        <td>{{ decision.deadline | date: 'medium' }}</td>
                                        
                                        <td *ngIf="userRole !== 'ROLE_BOARD_MEMBER'">
                                            <p-button icon="pi pi-pencil" [rounded]="true" [outlined]="true" (onClick)="editDecision(decision)" />
                                            <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (onClick)="deleteDecision(decision)" />
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
                                     [rowsPerPageOptions]="[10, 25, 50]">
                                <ng-template pTemplate="header">
                                    <tr>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Assigned To</th>
                                        <th>Deadline</th>
                                        <th>Decision</th>
                                        <th *ngIf="userRole !== 'ROLE_BOARD_MEMBER'">Actions</th>
                                    </tr>
                                </ng-template>
                                <ng-template pTemplate="body" let-task>
                                    <tr>
                                        <td>{{ task.description }}</td>
                                        <td>
                                            <p-tag [value]="task.status" [severity]="getTaskStatusSeverity(task.status)" />
                                        </td>
                                        <td>{{ task.assignedTo?.fullName }}</td>
                                        <td>{{ task.deadline | date: 'medium' }}</td>
                                        <td>{{ task.decision?.content }}</td>
                                        <td *ngIf="userRole !== 'ROLE_BOARD_MEMBER'">
                                            <p-button icon="pi pi-pencil" [rounded]="true" [outlined]="true" (onClick)="editTask(task)" />
                                            <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (onClick)="deleteTask(task)" />
                                        </td>
                                    </tr>
                                </ng-template>
                                <ng-template pTemplate="emptymessage">
                                    <tr>
                                        <td colspan="6" class="text-center p-4">
                                            <div class="flex flex-column align-items-center justify-content-center">
                                                <i class="pi pi-tasks text-4xl text-gray-400 mb-2"></i>
                                                <span class="text-gray-500">No tasks found</span>
                                            </div>
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
        <p-dialog [(visible)]="decisionDialog" [style]="{ width: '450px' }" header="Decision Details" [modal]="true">
            <div class="flex flex-col gap-4">
                <div>
                    <label for="content" class="block font-bold mb-2">Content</label>
                    <textarea fluid pTextarea id="content" [(ngModel)]="decision.content" rows="3" class="w-full"></textarea>
                </div>
                <div>
                    <label for="responsibleUser" class="block font-bold mb-2">Responsible User</label>
                    <p-dropdown [options]="userList" [(ngModel)]="decision.responsibleUser" optionLabel="fullName" placeholder="Select Responsible User" [style]="{ width: '100%' }" [scrollHeight]="'200px'" appendTo="body"> </p-dropdown>
                </div>
                <div>
                    <label for="deadline" class="block font-bold mb-2">Deadline</label>
                    <p-calendar fluid [(ngModel)]="decision.deadline" [showTime]="true" dateFormat="yy-mm-dd" />
                </div>
            </div>
            <ng-template pTemplate="footer">
                <p-button label="Cancel" icon="pi pi-times" (onClick)="hideDecisionDialog()" />
                <p-button label="Save" icon="pi pi-check" (onClick)="saveDecision()" />
                </ng-template>
            </p-dialog>

            <!-- Task Dialog -->
            <p-dialog [(visible)]="taskDialog" [style]="{width: '600px'}" header="Task Details" [modal]="true" 
                      [draggable]="false" [resizable]="false" styleClass="p-fluid">
                <div class="flex flex-col gap-6">
                    <div class="field">
                        <label for="description" class="block font-bold mb-2">Task Description</label>
                        <textarea pInputText id="description" [(ngModel)]="task.description" rows="3" 
                                  placeholder="Enter task description..." class="w-full"></textarea>
                    </div>

                    <div class="field">
                        <label for="status" class="block font-bold mb-2">Status</label>
                        <p-dropdown [options]="['PENDING', 'IN_PROGRESS', 'COMPLETED']" [(ngModel)]="task.status" 
                                  placeholder="Select status" styleClass="w-full" />
                    </div>

                    <div class="field">
                        <label for="assignedTo" class="block font-bold mb-2">Assigned To</label>
                        <p-dropdown [options]="userList" [(ngModel)]="task.assignedTo" 
                                  optionLabel="fullName" placeholder="Select user"
                                  styleClass="w-full" />
                    </div>

                    <div class="field">
                        <label for="deadline" class="block font-bold mb-2">Deadline</label>
                        <p-calendar [(ngModel)]="task.deadline" [showTime]="true" dateFormat="yy-mm-dd" 
                                   [showIcon]="true" styleClass="w-full" />
                    </div>

                    <div class="field">
                        <label for="decision" class="block font-bold mb-2">Associated Decision</label>
                        <p-dropdown [options]="decisions" [(ngModel)]="task.decision" 
                                  optionLabel="content" placeholder="Select decision"
                                  styleClass="w-full" />
                    </div>
                </div>
                <ng-template pTemplate="footer">
                    <div class="flex justify-end gap-2">
                        <p-button label="Cancel" icon="pi pi-times" (onClick)="hideTaskDialog()" />
                        <p-button label="Save" icon="pi pi-check" (onClick)="saveTask()" />
                    </div>
                </ng-template>
            </p-dialog>

            <!-- Meeting Edit Dialog -->
            <p-dialog [(visible)]="meetingDialog" [style]="{ width: '600px' }" header="Edit Meeting" [modal]="true" 
                      [draggable]="false" [resizable]="false" styleClass="p-fluid">
                <ng-template #content>
                    <div class="flex flex-col gap-6">
                        <div class="field">
                            <label for="title" class="block font-bold mb-2">Title</label>
                            <input type="text" pInputText fluid id="title" [(ngModel)]="editingMeeting.title" required autofocus />
                            <small class="text-red-500" *ngIf="submitted && !editingMeeting.title">Title is required.</small>
                        </div>

                        <div class="field">
                            <label for="agenda" class="block font-bold mb-2">Agenda</label>
                            <textarea pTextarea fluid id="agenda" [(ngModel)]="editingMeeting.agenda" required rows="3" 
                                      placeholder="Enter meeting agenda..."></textarea>
                        </div>

                        <div class="field">
                            <label for="objectives" class="block font-bold mb-2">Objectives</label>
                            <textarea pTextarea fluid id="objectives" [(ngModel)]="editingMeeting.objectives" required rows="3" 
                                      placeholder="Enter meeting objectives..."></textarea>
                        </div>
                        <div class="field">
                            <label for="participants" class="block font-bold mb-2">Participants</label>
                            <p-multiSelect [options]="userList" [(ngModel)]="editingMeeting.participants" 
                                         optionLabel="fullName" placeholder="Select Participants" 
                                         display="chip" class="w-full"
                                         [scrollHeight]="'200px'"
                                         [panelStyle]="{'min-width': '100%'}"
                                         [style]="{'width': '100%'}"
                                         [virtualScroll]="true"
                                         [virtualScrollItemSize]="34"
                                         appendTo="body">
                                <ng-template let-user pTemplate="item">
                                    <div class="flex align-items-center">
                                        <div>{{user.fullName}}</div>
                                    </div>
                                </ng-template>
                                <ng-template let-user pTemplate="selectedItem">
                                    <div class="flex align-items-center">
                                        <div>{{user.fullName}}</div>
                                    </div>
                                </ng-template>
                            </p-multiSelect>
                        </div>
                        <div class="field">
                            <label for="dateTime" class="block font-bold mb-2">Date & Time</label>
                            <p-calendar fluid [(ngModel)]="editingMeeting.dateTime" [showTime]="true" hourFormat="24" 
                                       dateFormat="yy-mm-dd" [showIcon]="true" class="w-full" />
                        </div>
                    </div>
                </ng-template>

                <ng-template #footer>
                    <div class="flex justify-end gap-2">
                        <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
                        <p-button label="Save" icon="pi pi-check" (click)="saveMeeting()" />
                    </div>
                </ng-template>
            </p-dialog>

            <p-toast></p-toast>
            <p-confirmdialog [style]="{ width: '450px' }" />
        `,
    providers: [MessageService, MeetingsService, DecisionsService, TasksService, UsersService, DocumentsService, ConfirmationService]
})
export class MeetingDetailsComponent implements OnInit {
    @ViewChild('fileUpload') fileUpload!: FileUpload;

    meeting: Meeting | null = null;
    decisions: Decision[] = [];
    tasks: Task[] = [];
    documents: Document[] = [];
    userList: User[] = [];

    // Dialog states
    decisionDialog: boolean = false;
    taskDialog: boolean = false;
    meetingDialog: boolean = false;
    submitted: boolean = false;

    // Form objects
    decision: Decision = {} as Decision;
    task: Task = {} as Task;
    editingMeeting: Meeting = {} as Meeting;

    // Task status options
    taskStatuses = [
        { name: 'Pending', value: 'PENDING' },
        { name: 'In Progress', value: 'IN_PROGRESS' },
        { name: 'Completed', value: 'COMPLETED' }
    ];

    uploadedFiles: any[] = [];

    userRole: string = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private meetingsService: MeetingsService,
        private decisionsService: DecisionsService,
        private tasksService: TasksService,
        private usersService: UsersService,
        private documentsService: DocumentsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private authService: AuthService,
        private reportService: ReportService
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
        console.log('Loading decisions for meeting:', meetingId);
        this.decisionsService.list(meetingId).subscribe({
            next: (decisions) => {
                console.log('Decisions received:', decisions);
                this.decisions = decisions;
                // Extract tasks from all decisions
                this.tasks = decisions.flatMap(decision => 
                    decision.tasks.map(task => ({
                        ...task,
                        decision: decision // Keep reference to parent decision
                    }))
                );
                console.log('Extracted tasks:', this.tasks);
            },
            error: (error) => {
                console.error('Error loading decisions:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load decisions: ' + (error.error?.message || 'Unknown error')
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
                console.log('Users loaded:', this.userList);
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

    onFileSelect(event: any) {
        this.uploadedFiles = event.files;
        console.log('Files selected:', this.uploadedFiles);
        // Automatically trigger upload when files are selected
        this.uploadDocument(event);
        // Refresh documents after a short delay to ensure backend processing
        setTimeout(() => {
            this.refreshDocuments();
        }, 1000);
    }

    onUploadError(event: any) {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error uploading file: ' + event.error
        });
    }

    onClear() {
        this.uploadedFiles = [];
    }

    uploadDocument(event: any) {
        if (!this.uploadedFiles.length) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please select at least one file to upload'
            });
            return;
        }

        const formData = new FormData();
        for (const file of this.uploadedFiles) {
            formData.append('file', file);
        }
        formData.append('meetingId', this.meeting?.id.toString() || '');

        this.documentsService.upload(formData).subscribe({
            next: (response) => {
                // Handle single document or array of documents
                const newDocuments = Array.isArray(response) ? response : [response];
                this.documents = [...this.documents, ...newDocuments];

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Documents uploaded successfully'
                });
                this.uploadedFiles = [];
                this.fileUpload.clear();
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to upload documents: ' + (error.error?.message || 'Unknown error')
                });
            }
        });
    }

    // Add a method to refresh documents
    refreshDocuments() {
        if (this.meeting?.id) {
            this.documentsService.list(this.meeting.id).subscribe({
                next: (documents) => {
                    this.documents = documents;
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                        detail: 'Failed to refresh documents'
                    });
                }
            });
        }
    }

    confirmDeleteDocument(document: Document) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete "${document.name}"?`,
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteDocument(document);
            },
            reject: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Cancelled',
                    detail: 'Delete operation cancelled'
                });
            }
        });
    }

    deleteDocument(document: Document) {
        this.documentsService.delete(document.id).subscribe({
            next: () => {
                this.documents = this.documents.filter((d) => d.id !== document.id);
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

    downloadDocument(doc: Document) {
        this.documentsService.download(doc.id).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = doc.name;
                link.click();
                window.URL.revokeObjectURL(url);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Document downloaded successfully'
                });
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
        // Ensure deadline is properly formatted
        if (this.decision.deadline) {
            this.decision.deadline = new Date(this.decision.deadline) as any;
        }
        this.decisionDialog = true;
    }

    hideDecisionDialog() {
        this.decisionDialog = false;
    }

    saveDecision() {
        if (this.decision.id) {
            this.decisionsService.update(this.decision.id, this.decision).subscribe({
                next: (updatedDecision) => {
                    const index = this.decisions.findIndex((d) => d.id === updatedDecision.id);
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
        this.confirmationService.confirm({
            message: `Are you sure you want to delete this decision?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
        this.decisionsService.delete(decision.id).subscribe({
            next: () => {
                        this.decisions = this.decisions.filter((d) => d.id !== decision.id);
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
        });
    }

    // Task methods
    openNewTask() {
        this.task = {
            id: 0,
            description: '',
            status: 'PENDING',
            assignedTo: {} as User,
            deadline: new Date().toISOString(),
            decision: {} as Decision
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
                        this.tasks[index] = { ...updatedTask, decision: this.task.decision };
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
                        detail: 'Failed to update task: ' + (error.error?.message || 'Unknown error')
                    });
                }
            });
        } else {
            this.tasksService.create(this.task).subscribe({
                next: (newTask) => {
                    this.tasks.push({ ...newTask, decision: this.task.decision });
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
                        detail: 'Failed to create task: ' + (error.error?.message || 'Unknown error')
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
                    detail: 'Failed to delete task: ' + (error.error?.message || 'Unknown error')
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
        if (this.meeting) {
            this.editingMeeting = { ...this.meeting };
            // Ensure dateTime is properly formatted
            if (this.editingMeeting.dateTime) {
                this.editingMeeting.dateTime = new Date(this.editingMeeting.dateTime) as any;
            }
            // Ensure participants are properly initialized with full user objects
            if (this.editingMeeting.participants) {
                this.editingMeeting.participants = this.editingMeeting.participants.map(participant => {
                    // If participant is already a full user object, use it
                    if (participant.id && participant.fullName) {
                        return participant;
                    }
                    // Otherwise, find the full user object from userList
                    const fullUser = this.userList.find(u => u.id === participant.id);
                    if (fullUser) {
                        return fullUser;
                    }
                    return participant;
                });
            } else {
                this.editingMeeting.participants = [];
            }
            this.meetingDialog = true;
            this.submitted = false;
        }
    }

    hideDialog() {
        this.meetingDialog = false;
        this.submitted = false;
    }

    saveMeeting() {
        this.submitted = true;

        if (this.editingMeeting.title?.trim()) {
            this.confirmationService.confirm({
                message: 'Are you sure you want to save the changes to this meeting?',
                header: 'Confirm Update',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    // Ensure dateTime is in ISO format before saving
                    if (this.editingMeeting.dateTime && typeof this.editingMeeting.dateTime === 'object') {
                        this.editingMeeting.dateTime = (this.editingMeeting.dateTime as Date).toISOString();
                    }
                    
                    // Format participants data
                    if (this.editingMeeting.participants) {
                        this.editingMeeting.participants = this.editingMeeting.participants.map(participant => {
                            // If participant is already a full user object, use it
                            if (participant.id && participant.fullName) {
                                return participant;
                            }
                            // Otherwise, find the full user object from userList
                            const fullUser = this.userList.find(u => u.id === participant.id);
                            if (fullUser) {
                                return fullUser;
                            }
                            return participant;
                        });
                    }
                    
                    console.log('Saving meeting with participants:', this.editingMeeting.participants);
                    
                    this.meetingsService.update(this.editingMeeting.id, this.editingMeeting).subscribe({
                        next: (updatedMeeting) => {
                            this.meeting = updatedMeeting;
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Meeting updated successfully',
                                life: 3000
                            });
                            this.meetingDialog = false;
                        },
                        error: (error) => {
                            console.error('Error updating meeting:', error);
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: error.error?.message || 'Failed to update meeting. You may not have the required permissions.',
                                life: 3000
                            });
                        }
                    });
                }
            });
        }
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
    downloadPDF() {
        if (this.meeting?.id) {  // Check if 'id' is defined
            this.reportService.downloadMeetingReport(this.meeting.id, 'pdf').subscribe({
                next: (response: Blob) => {
                    const blob = new Blob([response], { type: 'application/pdf' });
                    const url = window.URL.createObjectURL(blob);
                    window.open(url, '_blank'); 
                },
                error: (error: any) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to download PDF'    
                    });
                }
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Meeting ID is missing'    
            });
        }
    }
    
    downloadExcel() {
        if (this.meeting?.id) {  // Check if 'id' is defined
            this.reportService.downloadMeetingReport(this.meeting.id, 'xlsx').subscribe({
                next: (response: Blob) => {   
                    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    const url = window.URL.createObjectURL(blob);
                    window.open(url, '_blank');
                },
                error: (error: any) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to download Excel'
                    });
                }
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Meeting ID is missing'    
            });
        }
    }
    

}   
