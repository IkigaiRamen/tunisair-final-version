import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UsersService } from '../../core/services/users.service';
import { User } from '../../core/models/user.model';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { Role } from '../../core/models/role.model';

@Component({
    selector: 'app-admin-crud',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputIconModule,
        IconFieldModule, DialogModule, FormsModule, DropdownModule],
    template: `
    <p-toast></p-toast>
    <p-toolbar styleClass="mb-4">
      <ng-template #start>
        <p-button label="New User" icon="pi pi-plus" class="mr-2" (click)="openNew()"></p-button>
        <p-button label="Delete" icon="pi pi-trash" class="mr-2" [disabled]="!selectedUsers.length" (click)="deleteSelectedUsers()"></p-button>
      </ng-template>
    </p-toolbar>
    <p-table #dt [value]="users" [(selection)]="selectedUsers" [paginator]="true" [rows]="10" [rowsPerPageOptions]="[5,10,20]" dataKey="id" [globalFilterFields]="['fullName','email']">
      <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Manage Users</h5>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Search..." />
                    </p-iconfield>
                </div>
            </ng-template>
      <ng-template #header>
        <tr>
          <th style="width:3rem"><p-tableHeaderCheckbox></p-tableHeaderCheckbox></th>
          <th pSortableColumn="fullName">Full Name <p-sortIcon field="fullName"></p-sortIcon></th>
          <th pSortableColumn="email">Email <p-sortIcon field="email"></p-sortIcon></th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </ng-template>
      <ng-template #body let-user>
        <tr>
          <td><p-tableCheckbox [value]="user"></p-tableCheckbox></td>
          <td>{{user.fullName}}</td>
          <td>{{user.email}}</td>
          <td>{{ getRoleName(user) }}</td>         
          <td><p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="confirmDelete(user)"></p-button></td>
        </tr>
      </ng-template>
    </p-table>
    <p-confirmDialog header="Confirm" icon="pi pi-exclamation-triangle"></p-confirmDialog>

    <p-dialog [(visible)]="userDialog" [style]="{width: '450px'}" header="New User" [modal]="true" styleClass="p-fluid">
        <div class="field">
            <label for="fullName" class="block">Full Name</label>
            <input id="fullName" type="text" pInputText fluid [(ngModel)]="user.fullName" required autofocus />
        </div>
        <div class="field">
            <label for="email" class="block">Email</label>
            <input id="email" type="email" pInputText fluid [(ngModel)]="user.email" required />
        </div>
        <div class="field">
            <label for="password" class="block">Password</label>
            <input id="password" type="password" pInputText fluid [(ngModel)]="user.password" required />
        </div>
        <div class="field">
            <label for="role" class="block">Role</label>
            <p-dropdown [options]="availableRoles" [(ngModel)]="selectedRole" optionLabel="name" 
                       [filter]="true" placeholder="Select Role" [showClear]="true"
                       [appendTo]="'body'"
                       [style]="{'width': '100%'}"
                       [panelStyle]="{'min-width': '100%', 'max-height': '200px'}"
                       [autoDisplayFirst]="false">
            </p-dropdown>
        </div>
        <ng-template pTemplate="footer">
            <p-button label="Cancel" icon="pi pi-times" (click)="hideDialog()" styleClass="p-button-text"></p-button>
            <p-button label="Save" icon="pi pi-check" (click)="saveUser()" 
                     [disabled]="!user.fullName || !user.email || !user.password || !selectedRole"></p-button>
        </ng-template>
    </p-dialog>
  `,
    providers: [MessageService, UsersService, ConfirmationService]
})

export class AdminCrudComponent implements OnInit {
    users: User[] = [];
    selectedUsers: User[] = [];
    userDialog: boolean = false;
    user: User = {} as User;
    selectedRole: Role | null = null;
    availableRoles: Role[] = [
        { id: 1, name: 'ROLE_ADMIN' },
        { id: 2, name: 'ROLE_SECRETARY' },
        { id: 3, name: 'ROLE_BOARD_MEMBER' }
    ];

    constructor(
        private usersService: UsersService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.usersService.getAll().subscribe({
            next: (data) => (this.users = data),
            error: (err) => console.error('Error loading users', err)
        });
    }

    openNew() {
        this.user = {} as User;
        this.selectedRole = null;
        this.userDialog = true;
    }

    hideDialog() {
        this.userDialog = false;
    }

    saveUser() {
        if (this.selectedRole) {
            this.user.roles = [this.selectedRole];
            this.usersService.create(this.user).subscribe({
                next: (newUser) => {
                    this.users.push(newUser);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'User created successfully'
                    });
                    this.userDialog = false;
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to create user'
                    });
                }
            });
        }
    }

    getRoleName(user: User): string {
        return user.roles.length > 0 ? user.roles[0].name : '';
    }

    confirmDelete(user: User) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete ${user.fullName}?`,
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.usersService.delete(user.id).subscribe({
                    next: () => {
                        this.users = this.users.filter(u => u.id !== user.id);
                    },
                    error: (err) => {
                        console.error('Delete failed', err);
                    }
                });
            }
        });
    }

    deleteSelectedUsers() {
        if (this.selectedUsers.length === 0) return;

        this.confirmationService.confirm({
            message: `Are you sure you want to delete ${this.selectedUsers.length} users?`,
            header: 'Bulk Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const idsToDelete = this.selectedUsers.map(user => user.id);
                const deleteRequests = idsToDelete.map(id => this.usersService.delete(id));

                // Optionally use forkJoin to wait for all deletions if needed
                idsToDelete.forEach(id => {
                    this.usersService.delete(id).subscribe({
                        next: () => {
                            this.users = this.users.filter(u => u.id !== id);
                            this.selectedUsers = [];
                        },
                        error: (err) => {
                            console.error(`Delete failed for user with id ${id}`, err);
                        }
                    });
                });
            }
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
