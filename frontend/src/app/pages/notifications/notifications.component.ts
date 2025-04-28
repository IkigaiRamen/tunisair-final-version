import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationsService } from '../../core/services/notifications.service';
import { NotificationLog } from '../../core/models/notification-log.model';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';

@Component({
    selector: 'app-notifications',
    standalone: true,
    imports: [
        CommonModule, 
        RouterModule, 
        ButtonModule, 
        CardModule, 
        BadgeModule,
        InputTextModule,
        DropdownModule,
        FormsModule,
        CalendarModule
    ],
    template: `
        <div class="notifications-page">
            <div class="notifications-header">
                <h1>Notifications</h1>
                <div class="header-actions">
                    <button pButton 
                        *ngIf="unreadCount > 0" 
                        label="Mark All as Read" 
                        icon="pi pi-check" 
                        (click)="markAllAsRead()">
                    </button>
                </div>
            </div>

            <div class="filters-section">
                <div class="search-bar">
                    <span class="p-input-icon-left">
                        <i class="pi pi-search"></i>
                        <input pInputText 
                            [(ngModel)]="searchText" 
                            (ngModelChange)="filterNotifications()"
                            placeholder="Search notifications..." />
                    </span>
                </div>

                <div class="filters">
                    <p-dropdown 
                        [options]="statusOptions" 
                        [(ngModel)]="selectedStatus" 
                        (onChange)="filterNotifications()"
                        placeholder="Status"
                        [showClear]="true">
                    </p-dropdown>

                    <p-dropdown 
                        [options]="typeOptions" 
                        [(ngModel)]="selectedType" 
                        (onChange)="filterNotifications()"
                        placeholder="Type"
                        [showClear]="true">
                    </p-dropdown>

                    <p-calendar 
                        [(ngModel)]="dateRange" 
                        selectionMode="range" 
                        (onSelect)="filterNotifications()"
                        [showButtonBar]="true"
                        placeholder="Date Range"
                        [showClear]="true">
                    </p-calendar>
                </div>
            </div>

            <div class="notifications-container">
                <div class="notifications-stats">
                    <span class="total-count">Total: {{ filteredNotifications.length }}</span>
                    <span class="unread-count">Unread: {{ unreadCount }}</span>
                </div>

                <div class="notifications-list">
                    <p-card *ngFor="let notification of filteredNotifications" 
                        [ngClass]="{'unread': !notification.read}">
                        <div class="notification-card">
                            <div class="notification-icon">
                                <i class="pi" [ngClass]="notification.type === 'EMAIL' ? 'pi-envelope' : 'pi-info-circle'"></i>
                            </div>
                            <div class="notification-content">
                                <p class="notification-message">{{ notification.message }}</p>
                                <div class="notification-footer">
                                    <div class="notification-meta">
                                        <span class="notification-type">{{ notification.type }}</span>
                                        <small class="notification-time">{{ notification.sentAt | date: 'medium' }}</small>
                                    </div>
                                    <button *ngIf="!notification.read" 
                                        pButton 
                                        label="Mark as Read" 
                                        class="p-button-text" 
                                        (click)="markAsRead(notification)">
                                    </button>
                                </div>
                            </div>
                        </div>
                    </p-card>

                    <div *ngIf="filteredNotifications.length === 0" class="no-notifications">
                        <i class="pi pi-bell-slash"></i>
                        <p>No notifications found</p>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .notifications-page {
            padding: 2rem;
            max-width: 1000px;
            margin: 0 auto;

            .notifications-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;

                h1 {
                    margin: 0;
                    font-size: 2rem;
                }

                .header-actions {
                    display: flex;
                    gap: 1rem;
                }
            }

            .filters-section {
                background: var(--surface-card);
                padding: 1.5rem;
                border-radius: 8px;
                margin-bottom: 2rem;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

                .search-bar {
                    margin-bottom: 1rem;

                    input {
                        width: 100%;
                        padding: 0.75rem 1rem 0.75rem 2.5rem;
                    }
                }

                .filters {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;

                    p-dropdown, p-calendar {
                        flex: 1;
                        min-width: 200px;
                    }
                }
            }

            .notifications-container {
                .notifications-stats {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1rem;
                    padding: 0.5rem 1rem;
                    background: var(--surface-ground);
                    border-radius: 4px;

                    .total-count, .unread-count {
                        font-size: 0.875rem;
                        color: var(--text-color-secondary);
                    }

                    .unread-count {
                        color: var(--primary-color);
                        font-weight: 500;
                    }
                }

                .notifications-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;

                    .p-card {
                        &.unread {
                            background-color: rgba(var(--primary-color-rgb), 0.05);
                            border-left: 3px solid var(--primary-color);
                        }

                        .notification-card {
                            display: flex;
                            gap: 1rem;
                            align-items: flex-start;

                            .notification-icon {
                                background: var(--surface-ground);
                                padding: 1rem;
                                border-radius: 50%;
                                color: var(--primary-color);
                                font-size: 1.5rem;
                            }

                            .notification-content {
                                flex: 1;

                                .notification-message {
                                    margin: 0 0 0.5rem 0;
                                    font-size: 1rem;
                                    line-height: 1.5;
                                }

                                .notification-footer {
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;

                                    .notification-meta {
                                        display: flex;
                                        align-items: center;
                                        gap: 1rem;

                                        .notification-type {
                                            font-size: 0.75rem;
                                            padding: 0.25rem 0.5rem;
                                            background: var(--surface-ground);
                                            border-radius: 4px;
                                            color: var(--text-color-secondary);
                                        }

                                        .notification-time {
                                            color: var(--text-color-secondary);
                                        }
                                    }
                                }
                            }
                        }
                    }

                    .no-notifications {
                        text-align: center;
                        padding: 3rem;
                        color: var(--text-color-secondary);
                        background: var(--surface-card);
                        border-radius: 8px;

                        i {
                            font-size: 3rem;
                            margin-bottom: 1rem;
                            opacity: 0.5;
                        }

                        p {
                            margin: 0;
                            font-size: 1.1rem;
                        }
                    }
                }
            }
        }

        @media (max-width: 768px) {
            .notifications-page {
                padding: 1rem;

                .filters-section {
                    .filters {
                        flex-direction: column;

                        p-dropdown, p-calendar {
                            width: 100%;
                        }
                    }
                }
            }
        }
    `]
})
export class NotificationsComponent implements OnInit {
    notifications: NotificationLog[] = [];
    filteredNotifications: NotificationLog[] = [];
    unreadCount: number = 0;
    searchText: string = '';
    selectedStatus: string | null = null;
    selectedType: string | null = null;
    dateRange: Date[] | null = null;

    statusOptions = [
        { label: 'All', value: null },
        { label: 'Unread', value: 'unread' },
        { label: 'Read', value: 'read' }
    ];

    typeOptions = [
        { label: 'All', value: null },
        { label: 'Email', value: 'EMAIL' },
        { label: 'System', value: 'SYSTEM' }
    ];

    constructor(private notificationsService: NotificationsService) {}

    ngOnInit(): void {
        this.getNotifications();
    }

    getNotifications() {
        this.notificationsService.list().subscribe((notifications) => {
            this.notifications = notifications.sort((a, b) => 
                new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
            );
            this.filteredNotifications = [...this.notifications];
            this.updateUnreadCount();
        });
    }

    filterNotifications() {
        this.filteredNotifications = this.notifications.filter(notification => {
            // Search text filter
            const matchesSearch = !this.searchText || 
                notification.message.toLowerCase().includes(this.searchText.toLowerCase());

            // Status filter
            const matchesStatus = !this.selectedStatus || 
                (this.selectedStatus === 'unread' && !notification.read) ||
                (this.selectedStatus === 'read' && notification.read);

            // Type filter
            const matchesType = !this.selectedType || 
                notification.type === this.selectedType;

            // Date range filter
            const matchesDate = !this.dateRange || 
                (this.dateRange[0] && this.dateRange[1] &&
                new Date(notification.sentAt) >= this.dateRange[0] &&
                new Date(notification.sentAt) <= this.dateRange[1]);

            return matchesSearch && matchesStatus && matchesType && matchesDate;
        });
        this.updateUnreadCount();
    }

    updateUnreadCount() {
        this.unreadCount = this.filteredNotifications.filter(n => !n.read).length;
    }

    markAsRead(notification: NotificationLog) {
        if (!notification.read) {
            this.notificationsService.markRead(notification.id).subscribe(() => {
                notification.read = true;
                this.updateUnreadCount();
            });
        }
    }

    markAllAsRead() {
        const unreadNotifications = this.filteredNotifications.filter(n => !n.read);
        unreadNotifications.forEach(notification => {
            this.notificationsService.markRead(notification.id).subscribe(() => {
                notification.read = true;
            });
        });
        this.unreadCount = 0;
    }
} 