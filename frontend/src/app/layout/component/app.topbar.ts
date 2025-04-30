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
import { Popover, PopoverModule } from 'primeng/popover';
import { MeetingsService } from '../../core/services/meetings.service';
import { Meeting } from '../../core/models/meeting.model';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, MenuModule, MeetingCalendarComponent, BadgeModule, PopoverModule],
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
                        <!-- Calendar Button with Badge showing the number of upcoming meetings -->
                        <button type="button" class="layout-topbar-action" (click)="showCalendar()">
                            <i class="pi pi-calendar" style="font-size: 1.5rem;"></i>
                            <span>Calendar</span>
                            <!-- Badge displaying the number of upcoming meetings -->
                            <div *ngIf="upcomingMeetings.length > 0" class="p-overlay-badge">
                                <p-badge [value]="upcomingMeetings.length" severity="danger"></p-badge>
                            </div>
                        </button>

                        <!-- Bell Button with Notifications Badge -->
                        <button #bellButton type="button" class="layout-topbar-action" (click)="toggleNotifications($event)">
                            <div class="p-overlay-badge">
                                <i class="pi pi-bell" style="font-size: 1.5rem;"></i>
                                <p-badge [value]="unreadCount" severity="danger" *ngIf="unreadCount > 0"></p-badge>
                            </div>
                        </button>

                        <!-- Notifications Popover -->
                        <p-popover #notificationsOverlay 
                            [dismissable]="true" 
                            [style]="{ width: '320px' }"
                            [styleClass]="'notification-popover'">
                            <ng-template pTemplate="content">
                            <div class="notification-panel">
                                    <div class="notification-header">
                                <h4>Notifications</h4>
                                        <button *ngIf="unreadCount > 0" class="mark-all-read" (click)="markAllAsRead()">
                                            Mark all as read
                                        </button>
                                    </div>

                                <div *ngIf="notifications.length === 0" class="no-notifications">
                                        <i class="pi pi-bell-slash"></i>
                                    <p>No new notifications</p>
                                </div>

                                    <div class="notification-list">
                                        <div *ngFor="let notification of notifications" 
                                            class="notification-item" 
                                            [ngClass]="{'unread': !notification.read}"
                                            (click)="markAsRead(notification)">
                                            <div class="notification-icon">
                                                <i class="pi" [ngClass]="notification.type === 'EMAIL' ? 'pi-envelope' : 'pi-info-circle'"></i>
                                            </div>
                                            <div class="notification-content">
                                        <p class="notification-message">{{ notification.message }}</p>
                                                <small class="notification-time">{{ notification.sentAt | date: 'short' }}</small>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="notification-footer">
                                        <button class="view-all-btn" (click)="viewAllNotifications()">
                                            <i class="pi pi-list"></i>
                                            View All Notifications
                                        </button>
                                    </div>
                                </div>
                            </ng-template>
                        </p-popover>

                        <!-- Profile Menu -->
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
    @ViewChild('notificationsOverlay') notificationsOverlay!: Popover;
    unreadCount: number = 0;
    notificationsMenuItems: MenuItem[] = [];
    notifications: NotificationLog[] = [];
    upcomingMeetings: Meeting[] = [];
    userMenuItems: MenuItem[] = [];

    ngOnInit(): void {
        this.getNotifications();
        this.getUpcomingMeetings();
        this.updateUserMenuItems();
    }

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private router: Router,
        private notificationsService: NotificationsService,
        private meetingsService: MeetingsService
    ) {}

    updateUserMenuItems() {
        const isLoggedIn = this.authService.getToken() !== null;
        this.userMenuItems = [
            {
                label: 'Profile',
                icon: 'pi pi-user',
                routerLink: '/profile',
                visible: isLoggedIn
            },
            {
                label: 'Login',
                icon: 'pi pi-sign-in',
                routerLink: '/login',
                visible: !isLoggedIn
            },
            {
                label: 'Sign Up',
                icon: 'pi pi-user-plus',
                routerLink: '/signup',
                visible: !isLoggedIn
            },
            {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                command: () => this.logout(),
                visible: isLoggedIn
            }
        ];
    }

    getUpcomingMeetings() {
        this.meetingsService.getUpcomingMeetings(new Date().toISOString()).subscribe((meetings) => {
            this.upcomingMeetings = meetings;
        });
    }

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
            // Sort notifications by date (newest first) and take only the last 5
            this.notifications = notifications
                .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
                .slice(0, 5);
            this.unreadCount = this.notifications.filter((n) => !n.read).length;
        });
    }

    toggleNotifications(event: Event) {
        this.notificationsOverlay.toggle(event);
        // Mark all notifications as read when opening the panel
        if (this.unreadCount > 0) {
            this.markAllAsRead();
        }
    }

    markAsRead(notification: NotificationLog) {
        if (!notification.read) {
            this.notificationsService.markRead(notification.id).subscribe(() => {
                notification.read = true;
                this.unreadCount = this.notifications.filter(n => !n.read).length;
            });
        }
    }

    markAllAsRead() {
        const unreadNotifications = this.notifications.filter(n => !n.read);
        unreadNotifications.forEach(notification => {
            this.notificationsService.markRead(notification.id).subscribe(() => {
                notification.read = true;
            });
        });
        this.unreadCount = 0;
    }

    viewAllNotifications() {
        this.notificationsOverlay.hide();
        this.router.navigate(['/notifications']);
    }
}
