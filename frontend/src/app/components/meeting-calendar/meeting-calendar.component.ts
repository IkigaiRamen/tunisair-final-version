import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-meeting-calendar',
    standalone: true,
    imports: [CommonModule, CalendarModule, DialogModule, FormsModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
        <p-dialog 
            [(visible)]="visible" 
            [modal]="true" 
            [style]="{ width: '800px', height: '600px' }" 
            header="My Meetings Calendar"
            [draggable]="false"
            [resizable]="false"
            [closeOnEscape]="true"
            [contentStyle]="{ padding: '0.5rem', height: '100%' }"
            >
            <div class="calendar-container">
                <p-calendar 
                    [(ngModel)]="date" 
                    [inline]="true" 
                    [showWeek]="true"
                    (onSelect)="onDateSelect($event)"
                    [style]="{ width: '100%' }"
                    [styleClass]="'custom-calendar'">
                </p-calendar>
                
                <div class="meetings-list" *ngIf="selectedDateMeetings.length > 0">
                    <h3>Meetings on {{date | date:'mediumDate'}}</h3>
                    <ul>
                        <li *ngFor="let meeting of selectedDateMeetings">
                            {{meeting.time}} - {{meeting.title}}
                        </li>
                    </ul>
                </div>
                <div class="no-meetings" *ngIf="selectedDateMeetings.length === 0 && date">
                    <p>No meetings scheduled for this date.</p>
                </div>
            </div>
        </p-dialog>
    `,
    styles: [`
        :host ::ng-deep {
            .p-dialog {
                .p-dialog-content {
                    padding: 0.5rem;
                    height: 100%;
                }
                .p-dialog-header {
                    padding: 0.5rem;
                }
            }
            .custom-calendar {
                .p-calendar {
                    width: 100%;
                }
                .p-datepicker {
                    width: 100%;
                    font-size: 0.9rem;
                    padding: 0.25rem;
                    border: none;
                    display: block !important;
                }
                .p-datepicker-header {
                    padding: 0.25rem;
                }
                .p-datepicker table {
                    font-size: 0.9rem;
                    width: 100%;
                }
                .p-datepicker table td {
                    padding: 0.15rem;
                }
                .p-datepicker table td > span {
                    width: 2rem;
                    height: 2rem;
                }
            }
        }

        .calendar-container {
            padding: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .meetings-list {
            margin-top: 0.5rem;
            padding: 0.5rem;
            background-color: var(--surface-card);
            border-radius: 6px;
            flex: 1;
        }
        .meetings-list h3 {
            margin: 0 0 0.5rem 0;
            color: var(--text-color);
            font-size: 1rem;
        }
        .meetings-list ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .meetings-list li {
            padding: 0.25rem;
            border-bottom: 1px solid var(--surface-border);
            font-size: 0.9rem;
        }
        .meetings-list li:last-child {
            border-bottom: none;
        }
        .no-meetings {
            text-align: center;
            padding: 0.5rem;
            color: var(--text-color-secondary);
            font-size: 0.9rem;
        }
    `]
})
export class MeetingCalendarComponent implements OnInit {
    visible: boolean = false;
    date: Date | null = null;
    selectedDateMeetings: any[] = [];

    // Sample meetings data - replace this with your actual meetings data service
    meetings = [
        {
            date: new Date(2024, 2, 25),
            time: '10:00 AM',
            title: 'Team Meeting'
        },
        {
            date: new Date(2024, 2, 25),
            time: '2:00 PM',
            title: 'Client Call'
        },
        {
            date: new Date(2024, 2, 26),
            time: '11:00 AM',
            title: 'Project Review'
        }
    ];

    ngOnInit() {
        this.date = new Date();
        this.updateSelectedDateMeetings();
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    onDateSelect(date: Date) {
        this.updateSelectedDateMeetings();
    }

    private updateSelectedDateMeetings() {
        if (!this.date) return;
        
        this.selectedDateMeetings = this.meetings.filter(meeting => 
            meeting.date.getDate() === this.date?.getDate() &&
            meeting.date.getMonth() === this.date?.getMonth() &&
            meeting.date.getFullYear() === this.date?.getFullYear()
        );
    }
}