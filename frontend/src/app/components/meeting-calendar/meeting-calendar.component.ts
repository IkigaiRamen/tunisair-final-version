import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { MeetingsService } from '../../core/services/meetings.service';
import { Meeting } from '../../core/models/meeting.model';

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
            [contentStyle]="{ padding: '0.5rem', height: '100%' }">
            <div class="calendar-container">
                <p-calendar 
                    [(ngModel)]="date" 
                    [inline]="true" 
                    [showWeek]="true"
                    (onSelect)="onDateSelect($event)"
                    [style]="{ width: '100%' }"
                    [styleClass]="'custom-calendar'">
                    <ng-template pTemplate="date" let-date>
                        <span [ngStyle]="getDateStyle(date)">
                            {{date.day}}
                        </span>
                    </ng-template>
                </p-calendar>

                <div class="meetings-list" *ngIf="selectedDateMeetings.length > 0">
                    <h3>Meetings on {{ date | date: 'mediumDate' }}</h3>
                    <ul>
                        <li *ngFor="let meeting of selectedDateMeetings">
                            {{ meeting.dateTime | date: 'shortTime' }} - {{ meeting.title }}
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
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                }
                .p-datepicker table td > span.has-meeting {
                    background-color: #007bff !important;
                    color: white !important;
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
    selectedDateMeetings: Meeting[] = [];
    meetingsDates: Set<string> = new Set();

    constructor(private meetingsService: MeetingsService) {}

    ngOnInit() {
        this.date = new Date();
        this.loadMeetings();
    }

    show() {
        this.visible = true;
        this.loadMeetings();
    }

    hide() {
        this.visible = false;
    }

    onDateSelect(event: any) {
        this.date = event.value;
        this.updateSelectedDateMeetings();
    }

    private loadMeetings() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        this.meetingsService.getUpcomingMeetings(today.toISOString()).subscribe({
            next: (meetings) => {
                this.meetingsDates.clear();
                meetings.forEach(meeting => {
                    const meetingDate = new Date(meeting.dateTime);
                    meetingDate.setHours(0, 0, 0, 0);
                    this.meetingsDates.add(meetingDate.toISOString());
                });
                this.updateSelectedDateMeetings();
            },
            error: (error) => {
                console.error('Error fetching meetings:', error);
            }
        });
    }

    private updateSelectedDateMeetings() {
        if (!this.date) return;

        const selectedDate = new Date(this.date);
        selectedDate.setHours(0, 0, 0, 0);

        this.meetingsService.getUpcomingMeetings(selectedDate.toISOString()).subscribe({
            next: (meetings) => {
                this.selectedDateMeetings = meetings.filter(meeting => {
                    const meetingDate = new Date(meeting.dateTime);
                    meetingDate.setHours(0, 0, 0, 0);
                    return meetingDate.getTime() === selectedDate.getTime();
                });
            },
            error: (error) => {
                console.error('Error fetching meetings for selected date:', error);
            }
        });
    }

    getDateStyle(date: any) {
        const currentDate = new Date(date.year, date.month, date.day);
        currentDate.setHours(0, 0, 0, 0);
        
        const hasMeeting = Array.from(this.meetingsDates).some(meetingDate => {
            const meeting = new Date(meetingDate);
            meeting.setHours(0, 0, 0, 0);
            return meeting.getTime() === currentDate.getTime();
        });

        return {
            'background-color': hasMeeting ? '#007bff' : 'transparent',
            'color': hasMeeting ? 'white' : 'inherit',
            'border-radius': '50%',
            'width': '2rem',
            'height': '2rem',
            'display': 'flex',
            'align-items': 'center',
            'justify-content': 'center'
        };
    }
}
