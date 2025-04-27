import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { Menu, MenuModule } from 'primeng/menu';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { MeetingCalendarComponent } from '../../components/meeting-calendar/meeting-calendar.component';
import { AuthService } from '../../core/services/auth.service';
import { NotificationsService } from '../../core/services/notifications.service';
import { NotificationLog } from '../../core/models/notification-log.model';
import { BadgeModule } from 'primeng/badge';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, MenuModule, MeetingCalendarComponent, BadgeModule, OverlayPanelModule],
    template: `
        <div class="layout-topbar">
            <div class="layout-topbar-logo-container">
                <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                    <i class="pi pi-bars"></i>
                </button>
                <a class="layout-topbar-logo" routerLink="/">
                    <img src="assets/images/Tunisair.png" alt="Tunisair Logo" height="40" />
                </a>
            </div>

            <div class="layout-topbar-actions">
                <div class="layout-config-menu">
                    <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                        <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                    </button>
                    <div class="relative">
                        <button
                            class="layout-topbar-action layout-topbar-action-highlight"
                            pStyleClass="@next"
                            enterFromClass="hidden"
                            enterActiveClass="animate-scalein"
                            leaveToClass="hidden"
                            leaveActiveClass="animate-fadeout"
                            [hideOnOutsideClick]="true"
                        >
                            <i class="pi pi-palette"></i>
                        </button>
                        <app-configurator />
                    </div>
                </div>

                <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                    <i class="pi pi-ellipsis-v"></i>
                </button>

                <div class="layout-topbar-menu hidden lg:block">
                    <div class="layout-topbar-menu-content">
                        <button type="button" class="layout-topbar-action" (click)="showCalendar()">
                            <i class="pi pi-calendar"></i>
                            <span>Calendar</span>
                        </button>
                        <button #bellButton type="button" class="layout-topbar-action relative" (click)="toggleNotifications($event)">
                            <i class="pi pi-bell"></i>
                            <span *ngIf="notifications.length > 0" class="p-badge">{{ notifications.length }}</span>
                        </button>

                        <p-overlayPanel #notificationsOverlay [dismissable]="true">
                            <div class="notification-panel">
                                <h4>Notifications</h4>

                                <div *ngIf="notifications.length === 0" class="no-notifications">
                                    <p>No new notifications</p>
                                </div>

                                <div *ngFor="let notification of notifications" class="notification-item">
                                    <i class="pi pi-info-circle"></i>
                                    <div>
                                        <p class="notification-message">{{ notification.message }}</p>
                                        <small>{{ notification.sentAt | date: 'short' }}</small>
                                    </div>
                                </div>
                            </div>
                        </p-overlayPanel>

                        <button type="button" class="layout-topbar-action" (click)="menu.toggle($event)">
                            <i class="pi pi-user"></i>
                            <span>Profile</span>
                        </button>
                        <p-menu #menu [popup]="true" [model]="userMenuItems"></p-menu>
                    </div>
                </div>
            </div>
        </div>
        <app-meeting-calendar #calendar></app-meeting-calendar>
    `
})
export class AppTopbar implements OnInit {
    @ViewChild('calendar') calendar!: MeetingCalendarComponent;
    @ViewChild('notificationsMenu') notificationsMenu!: Menu;
    @ViewChild('bellButton') bellButton!: ElementRef;
    @ViewChild('notificationsOverlay') notificationsOverlay!: OverlayPanel;
    notificationsMenuItems: MenuItem[] = [];
    notifications: NotificationLog[] = [];
    userMenuItems: MenuItem[] = [
        {
            label: 'Profile',
            icon: 'pi pi-user',
            routerLink: '/profile'
        },
        {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => this.logout()
        }
    ];
    ngOnInit(): void {
        this.getNotifications();
    }

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private router: Router,
        private notificationsService: NotificationsService
    ) {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
    }

    showCalendar() {
        this.calendar.show();
    }
    getNotifications() {
        this.notificationsService.list().subscribe((notifications) => {
            this.notifications = notifications;
            this.notificationsMenuItems = this.notifications.map((n) => ({
                label: n.message, // or whatever property you want to show
                icon: 'pi pi-info-circle' // you can pick an appropriate icon
            }));
        });
    }

    toggleNotifications(event: Event) {
        this.notificationsOverlay.toggle(event);
    }
}
