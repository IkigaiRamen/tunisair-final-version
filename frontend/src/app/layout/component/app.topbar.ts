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
                        <p-popover #notificationsOverlay [dismissable]="true">
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
        this.getUpcomingMeetings();
    }

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private router: Router,
        private notificationsService: NotificationsService,
        private meetingsService: MeetingsService
    ) {}
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
            console.log('Fetched notifications:', notifications);

            this.notifications = notifications;
            this.unreadCount = this.notifications.filter((n) => !n.read).length;

            console.log('Unread count:', this.unreadCount);

            this.notificationsMenuItems = this.notifications.map((n) => ({
                label: n.message,
                icon: 'pi pi-info-circle'
            }));
        });
    }

    toggleNotifications(event: Event) {
        this.notificationsOverlay.toggle(event);
    }
}
