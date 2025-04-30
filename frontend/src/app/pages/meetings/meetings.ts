import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Meeting } from '../../core/models/meeting.model';
import { MeetingsService } from '../../core/services/meetings.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { User } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';
import { UsersService } from '../../core/services/users.service';
import { MultiSelect, MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-crud',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        MultiSelectModule,
        CalendarModule,
    ],
    template: `
        <p-toast></p-toast>
        <div class="grid grid-cols-12 gap-8">
            <div class="col-span-full">
                <div class="card">
                    <p-toolbar styleClass="mb-6 border-none">
                        <ng-template #start>
                            <div class="flex gap-2">
                                <p-button label="New Meeting" icon="pi pi-plus" severity="secondary" (onClick)="openNew()" />
                                <p-button severity="danger" label="Delete Selected" icon="pi pi-trash" outlined (onClick)="deleteSelectedMeetings()" 
                                         [disabled]="!selectedMeetings || !selectedMeetings.length" />
                            </div>
                        </ng-template>

                        <ng-template #end>
                            <p-button label="Export" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
                        </ng-template>
                    </p-toolbar>

                    <p-table #dt [value]="meetings()" [rows]="10" [columns]="cols" [paginator]="true"
                            [globalFilterFields]="['title', 'createdBy.fullName']" [tableStyle]="{ 'min-width': '75rem' }"
                            [(selection)]="selectedMeetings" [rowHover]="true" dataKey="id" [rowsPerPageOptions]="[10, 20, 30]"
                            styleClass="p-datatable-sm">
                        <ng-template #caption>
                            <div class="flex items-center justify-between">
                                <h5 class="text-xl font-semibold m-0">Manage Meetings</h5>
                                <p-iconfield>
                                    <p-inputicon styleClass="pi pi-search" />
                                    <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" 
                                           placeholder="Search meetings..." class="p-inputtext-sm" />
                                </p-iconfield>
                            </div>
                        </ng-template>
                        <ng-template #header>
                            <tr>
                                <th style="width: 3rem">
                                    <p-tableHeaderCheckbox />
                                </th>
                                <th pSortableColumn="Title" style="min-width:16rem">
                                    Title <p-sortIcon field="Title" />
                                </th>
                                <th pSortableColumn="dateTime" style="min-width:16rem">
                                    Date <p-sortIcon field="dateTime" />
                                </th>
                                <th pSortableColumn="Created By" style="min-width:10rem">
                                    Created By <p-sortIcon field="Created By" />
                                </th>
                                <th pSortableColumn="Participants" style="min-width: 12rem">
                                    Participants <p-sortIcon field="Participants" />
                                </th>
                                <th pSortableColumn="virtualLink" style="min-width: 12rem">
                                    Virtual Link <p-sortIcon field="virtualLink" />
                                </th>
                                <th style="min-width: 8rem">Actions</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-meeting>
                            <tr>
                                <td style="width: 3rem">
                                    <p-tableCheckbox [value]="meeting" />
                                </td>
                                <td class="font-medium">{{ meeting.title }}</td>
                                <td>{{ meeting.dateTime | date: 'medium' }}</td>
                                <td>{{ meeting.createdBy?.fullName || 'N/A' }}</td>
                                <td>
                                    <div class="flex flex-wrap gap-1">
                                        <p-tag *ngFor="let p of meeting.participants" 
                                               [value]="p.fullName" 
                                               severity="info" 
                                               styleClass="text-xs" />
                                    </div>
                                </td>
                                <td>
                                    <a *ngIf="meeting.virtualLink" [href]="meeting.virtualLink" target="_blank" 
                                       class="text-primary hover:underline">
                                        Join Meeting
                                    </a>
                                    <span *ngIf="!meeting.virtualLink" class="text-gray-500">-</span>
                                </td>
                                <td>
                                    <div class="flex gap-2">
                                        <p-button icon="pi pi-pencil" class="p-button-sm" [rounded]="true" [outlined]="true" 
                                                  (click)="editMeeting(meeting)" />
                                        <p-button icon="pi pi-trash" severity="danger" class="p-button-sm" [rounded]="true" [outlined]="true" 
                                                  (click)="deleteMeeting(meeting)" />
                                    </div>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>
        </div>

        <p-dialog [(visible)]="meetingDialog" [style]="{ width: '600px' }" header="Meeting Details" [modal]="true" 
                  [draggable]="false" [resizable]="false" styleClass="p-fluid">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div class="field">
                        <label for="title" class="block font-bold mb-2">Title</label>
                        <input type="text" pInputText fluid id="title" [(ngModel)]="meeting.title" required autofocus />
                        <small class="text-red-500" *ngIf="submitted && !meeting.title">Title is required.</small>
                    </div>

                    <div class="field">
                        <label for="agenda" class="block font-bold mb-2">Agenda</label>
                        <textarea pTextarea fluid id="agenda" [(ngModel)]="meeting.agenda" required rows="3" 
                                  placeholder="Enter meeting agenda..."></textarea>
                    </div>

                    <div class="field">
                        <label for="objectives" class="block font-bold mb-2">Objectives</label>
                        <textarea pTextarea fluid id="objectives" [(ngModel)]="meeting.objectives" required rows="3" 
                                  placeholder="Enter meeting objectives..."></textarea>
                    </div>
                    <div class="field">
                        <label for="participants" class="block font-bold mb-2">Participants</label>
                        <p-multiSelect [options]="userList" [(ngModel)]="meeting.participants" 
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
                        <p-calendar fluid [(ngModel)]="meeting.dateTime" [showTime]="true" hourFormat="24" 
                                   dateFormat="yy-mm-dd" [showIcon]="true" class="w-full" />
                    </div>

                    <div class="field">
                        <label for="virtualLink" class="block font-bold mb-2">Virtual Meeting Link</label>
                        <input type="url" pInputText fluid id="virtualLink" [(ngModel)]="meeting.virtualLink" 
                               placeholder="Enter virtual meeting link (optional)" />
                        <small class="text-gray-500">Leave empty if this is an in-person meeting</small>
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

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, MeetingsService, ConfirmationService, AuthService, UsersService],
})
export class meetings implements OnInit {
    meetingDialog: boolean = false;

    meetings = signal<Meeting[]>([]);

    meeting!: Meeting;

    selectedMeetings!: Meeting[] | null;

    submitted: boolean = false;

    userList: User[] = [];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private meetingService: MeetingsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private authService: AuthService,
        private userService: UsersService,
    ) { }

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadDemoData();
        this.userService.getAll().subscribe({
            next: (users) => {
                this.userList = users;
                console.log('Users loaded:', this.userList); // Debug log
            },
            error: (err) => {
                console.error('Error fetching users', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load users',
                    life: 3000
                });
            }
        });
    }

    loadDemoData() {
        this.meetingService.list().subscribe((data) => {
            this.meetings.set(data);
        });

        // Define the columns based on the fields in your Meeting model
        this.cols = [
            { field: 'id', header: 'ID' }, // Meeting ID
            { field: 'title', header: 'Title' }, // Meeting Title
            { field: 'dateTime', header: 'Date & Time' }, // Date and Time
            { field: 'createdBy.name', header: 'Created By' }, // Created By - User name
            { field: 'participants', header: 'Participants' }, // List of Participants (you may want to format this)
            { field: 'virtualLink', header: 'Virtual Link' }, // Virtual Link
            { field: 'actions', header: 'Actions' } // Actions column for edit/delete buttons
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        // Initialize meeting with default values
        this.meeting = {
            id: 0,
            title: '',
            dateTime: '',
            createdBy: {} as User,
            participants: [],
            documents: [],
            decisions: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            virtualLink: ''
        };
        this.submitted = false;
        this.meetingDialog = true;
    }

    editMeeting(meeting: Meeting) {
        this.meeting = { ...meeting };
        // Ensure dateTime is properly formatted
        if (this.meeting.dateTime) {
            this.meeting.dateTime = new Date(this.meeting.dateTime) as any;
        }
        // Ensure participants are properly initialized with full user objects
        if (this.meeting.participants) {
            this.meeting.participants = this.meeting.participants.map(participant => {
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
            this.meeting.participants = [];
        }
        this.meetingDialog = true;
        this.submitted = false;
    }

    deleteSelectedMeetings() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected meetings?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const idsToDelete = this.selectedMeetings?.map((m) => m.id) || [];

                // Use forkJoin to wait for all delete requests to complete
                const deletionObservables = idsToDelete.map((id) => this.meetingService.delete(id));

                forkJoin(deletionObservables).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Selected meetings deleted',
                            life: 3000
                        });
                        this.selectedMeetings = [];
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to delete one or more meetings',
                            life: 3000
                        });
                    }
                });
            }
        });
    }

    hideDialog() {
        this.meetingDialog = false;
        this.submitted = false;
    }

    deleteMeeting(meeting: Meeting) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete the meeting titled "${meeting.title}"?`,
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.meetingService.delete(meeting.id).subscribe({
                    next: () => {
                        this.meetings.set(this.meetings().filter((val) => val.id !== meeting.id));
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Meeting deleted successfully',
                            life: 3000
                        });
                    },
                    error: (error) => {
                        console.error('Error deleting meeting:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error.error?.message || 'Failed to delete meeting. You may not have the required permissions.',
                            life: 3000
                        });
                    }
                });
            }
        });
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.meetings().length; i++) {
            if (this.meetings()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    saveMeeting() {
        this.submitted = true;

        if (this.meeting.title?.trim()) {
            // Show loading message immediately
            this.messageService.add({
                severity: 'info',
                summary: 'Saving',
                detail: 'Saving meeting changes...',
                life: 2000
            });

            this.authService.me().subscribe({
                next: (user) => {
                    this.meeting.createdBy = user;

                    if (this.meeting.id) {
                        // Ensure dateTime is in ISO format before saving
                        if (this.meeting.dateTime && typeof this.meeting.dateTime === 'object') {
                            this.meeting.dateTime = (this.meeting.dateTime as Date).toISOString();
                        }

                        // Close dialog immediately to improve UX
                        this.meetingDialog = false;

                        this.meetingService.update(this.meeting.id, this.meeting).subscribe({
                            next: (updatedMeeting) => {
                                const _meetings = this.meetings();
                                const index = _meetings.findIndex((m) => m.id === updatedMeeting.id);
                                if (index !== -1) {
                                    _meetings[index] = updatedMeeting;
                                    this.meetings.set([..._meetings]);
                                }

                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Success',
                                    detail: 'Meeting updated successfully',
                                    life: 1000
                                });
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
                    } else {
                        this.meeting.createdAt = new Date().toISOString();
                        this.meeting.updatedAt = new Date().toISOString();

                        // Close dialog immediately to improve UX
                        this.meetingDialog = false;

                        this.meetingService.create(this.meeting).subscribe({
                            next: (createdMeeting) => {
                                const _meetings = this.meetings();
                                this.meetings.set([..._meetings, createdMeeting]);

                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Success',
                                    detail: 'Meeting created successfully',
                                    life: 3000
                                });
                            },
                            error: (error) => {
                                console.error('Error creating meeting:', error);
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: error.error?.message || 'Failed to create meeting',
                                    life: 3000
                                });
                            }
                        });
                    }
                },
                error: (error) => {
                    console.error('Error fetching current user:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to fetch current user information',
                        life: 3000
                    });
                }
            });
        }
    }
}
