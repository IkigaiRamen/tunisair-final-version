import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
          
            {
                label: 'Meetings',
                items: [
                    { label: 'Upcoming Meetings', icon: 'pi pi-fw pi-calendar', routerLink: ['/', 'meetings', 'upcoming'] },
                    { label: 'Past Meetings', icon: 'pi pi-fw pi-history', routerLink: ['/', 'meetings', 'past'] },
                    { label: 'Plan New Meeting', icon: 'pi pi-fw pi-plus', routerLink: ['/', 'meetings', 'new'] }
                ]
            },
            {
                label: 'Documents',
                items: [
                    { label: 'All Documents', icon: 'pi pi-fw pi-folder', routerLink: ['/documents'] },
                    { label: 'By Meeting', icon: 'pi pi-fw pi-link', routerLink: ['/documents/by-meeting'] },
                    { label: 'Upload Document', icon: 'pi pi-fw pi-upload', routerLink: ['/documents/upload'] }
                ]
            },
            {
                label: 'Decisions & Tasks',
                items: [
                    { label: 'Decisions Log', icon: 'pi pi-fw pi-file-edit', routerLink: ['/decisions-tasks/decisions'] },
                    { label: 'Tasks Dashboard', icon: 'pi pi-fw pi-check-square', routerLink: ['/decisions-tasks/tasks'] },
                    { label: 'My Decisions & Tasks ', icon: 'pi pi-fw pi-check-square', routerLink: ['/decisions-tasks/my-decisions-tasks'] }
                ]
            },
            {
                label: 'Reports',
                items: [
                    { label: 'Meeting Summaries', icon: 'pi pi-fw pi-book', routerLink: ['/reports/meeting-summaries'] },
                    { label: 'Download Reports', icon: 'pi pi-fw pi-download', routerLink: ['/reports/download'] }
                ]
            },
            {
                label: 'Notifications',
                items: [
                    { label: 'Reminders', icon: 'pi pi-fw pi-bell', routerLink: ['/notifications'] },
                    { label: 'Email Settings', icon: 'pi pi-fw pi-envelope', routerLink: ['/notifications/settings'] }
                ]
            },
            {
                label: 'User Management',
                items: [{ label: 'Users & Roles', icon: 'pi pi-fw pi-users', routerLink: ['/pages/admin'] }]
            },
            {
                label: 'Settings',
                items: [{ label: 'System Settings', icon: 'pi pi-fw pi-cog', routerLink: ['/settings'] }]
            },

            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                 
                    {
                        label: 'Auth',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Login',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/auth/login']
                            },
                            {
                                label: 'Error',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['/auth/error']
                            },
                            {
                                label: 'Access Denied',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/auth/access']
                            }
                        ]
                    },
                    
                ]
            },
        

        ];
    }
}
