import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul>`
})
export class AppMenu {
    model: MenuItem[] = [];
    userRole: string = '';

    constructor(private authService: AuthService) {}

    ngOnInit() {
        this.authService.me().subscribe({
            next: (user: User) => {
                this.userRole = user.roles[0].name;
                this.initializeMenu();
            },
            error: (error: any) => {
                console.error('Error fetching current user', error);
            }
        });
    }

    private initializeMenu() {
        const commonMenuItems: MenuItem[] = [
            {
                label: 'Meetings',
                items: [
                    { label: 'Upcoming Meetings', icon: 'pi pi-fw pi-calendar', routerLink: ['/', 'meetings', 'upcoming'] },
                    { label: 'Past Meetings', icon: 'pi pi-fw pi-history', routerLink: ['/', 'meetings', 'past'] }
                ]
            },
            {
                label: 'Documents',
                items: [
                    { label: 'All Documents', icon: 'pi pi-fw pi-folder', routerLink: ['/documents'] },
                    { label: 'By Meeting', icon: 'pi pi-fw pi-link', routerLink: ['/documents/by-meeting'] },
                    { label: 'Upload Document', icon: 'pi pi-fw pi-upload', routerLink: ['/documents/upload'] } // Moved to common menu
                ]
            },
            {
                label: 'Decisions & Tasks',
                items: [
                    { label: 'Decisions Log', icon: 'pi pi-fw pi-file-edit', routerLink: ['/decisions-tasks/decisions'] },
                    { label: 'Tasks Dashboard', icon: 'pi pi-fw pi-check-square', routerLink: ['/decisions-tasks/tasks'] },
                    { label: 'My Decisions & Tasks', icon: 'pi pi-fw pi-check-square', routerLink: ['/decisions-tasks/my-decisions-tasks'] }
                ]
            },
            {
                label: 'Reports',
                items: [
                    { label: 'Meeting Summaries', icon: 'pi pi-fw pi-book', routerLink: ['/reports/meeting-summaries'] },
                    { label: 'Download Reports', icon: 'pi pi-fw pi-download', routerLink: ['/reports/download'] }
                ]
            }
        ];
    
        const adminMenuItems: MenuItem[] = [
            {
                label: 'User Management',
                items: [{ label: 'Users & Roles', icon: 'pi pi-fw pi-users', routerLink: ['/pages/admin'] }]
            },
            {
                label: 'Settings',
                items: [{ label: 'System Settings', icon: 'pi pi-fw pi-cog', routerLink: ['/settings'] }]
            }
        ];
    
        const secretaryMenuItems: MenuItem[] = [
            {
                label: 'Documents',
                items: [
                    // Removed the "Upload Document" option from here
                ]
            }
        ];
    
        // Add role-specific menu items
        switch (this.userRole) {
            case 'ROLE_ADMIN':
                // Admin can see "Plan New Meeting" inside the "Meetings" section
                commonMenuItems[0].items?.push({
                    label: 'Plan New Meeting',
                    icon: 'pi pi-fw pi-plus',
                    routerLink: ['/meetings/new']
                });
                this.model = [...commonMenuItems, ...adminMenuItems, ...secretaryMenuItems];
                break;
            case 'ROLE_SECRETARY':
                // Secretary can see "Plan New Meeting" inside the "Meetings" section
                commonMenuItems[0].items?.push({
                    label: 'Plan New Meeting',
                    icon: 'pi pi-fw pi-plus',
                    routerLink: ['/meetings/new']
                });
                this.model = [...commonMenuItems, ...secretaryMenuItems];
                break;
            case 'ROLE_BOARD_MEMBER':
                this.model = [...commonMenuItems];
                break;
            default:
                this.model = commonMenuItems;
        }
    
        // Add notifications menu for all roles
        this.model.push({
            label: 'Notifications',
            items: [
                { label: 'Reminders', icon: 'pi pi-fw pi-bell', routerLink: ['/notifications'] },
                { label: 'Email Settings', icon: 'pi pi-fw pi-envelope', routerLink: ['/notifications/settings'] }
            ]
        });
    }
}
