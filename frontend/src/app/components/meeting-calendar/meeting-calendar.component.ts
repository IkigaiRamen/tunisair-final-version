import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { MeetingsService } from '../../core/services/meetings.service';
import { Meeting } from '../../core/models/meeting.model';
import { AuthService } from '../../core/services/auth.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
    selector: 'app-meeting-calendar',
    standalone: true,
    imports: [CommonModule, CalendarModule, DialogModule, FormsModule, CardModule, ButtonModule],
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

                <div class="meetings-section">
                    <div class="meetings-list" *ngIf="selectedDateMeetings.length > 0">
                        <h3>Meetings on {{ date | date: 'mediumDate' }}</h3>
                        <ul>
                            <li *ngFor="let meeting of selectedDateMeetings" 
                                (click)="selectMeeting(meeting)"
                                [class.selected]="selectedMeeting?.id === meeting.id">
                                {{ meeting.dateTime | date: 'shortTime' }} - {{ meeting.title }}
                            </li>
                        </ul>
                    </div>

                    <div class="no-meetings" *ngIf="selectedDateMeetings.length === 0 && date">
                        <p>No meetings scheduled for this date.</p>
                    </div>

                    <div class="meeting-details" *ngIf="selectedMeeting">
                        <p-card [header]="selectedMeeting.title">
                            <div class="details-content">
                                <div class="field">
                                    <label>Time:</label>
                                    <p>{{ selectedMeeting.dateTime | date: 'medium' }}</p>
                                </div>
                               
                                <div class="field">
                                    <label>Created By:</label>
                                    <p>{{ selectedMeeting.createdBy.fullName }}</p>
                                </div>
                                <div class="field">
                                    <label>Participants:</label>
                                    <p>{{ selectedMeeting.participants.length || 0 }} participants</p>
                                </div>
                                <div class="actions">
                                    <p-button label="View Details" 
                                             icon="pi pi-external-link"
                                             (onClick)="viewMeetingDetails()"
                                             styleClass="p-button-text"></p-button>
                                </div>
                            </div>
                        </p-card>
                    </div>
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
            gap: 1rem;
        }

        .meetings-section {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            flex: 1;
            overflow: auto;
        }

        .meetings-list {
            padding: 0.5rem;
            background-color: var(--surface-card);
            border-radius: 6px;
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
            padding: 0.5rem;
            border-bottom: 1px solid var(--surface-border);
            font-size: 0.9rem;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .meetings-list li:hover {
            background-color: var(--surface-hover);
        }

        .meetings-list li.selected {
            background-color: var(--primary-color);
            color: white;
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

        .meeting-details {
            margin-top: 1rem;
        }

        .details-content {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .field {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        .field label {
            font-weight: 600;
            color: var(--text-color-secondary);
        }

        .actions {
            margin-top: 1rem;
            display: flex;
            justify-content: flex-end;
        }
    `]
})
export class MeetingCalendarComponent implements OnInit {
    visible: boolean = false;
    date: Date | null = null;
    selectedDateMeetings: Meeting[] = [];
    meetingsDates: Set<string> = new Set();
    selectedMeeting: Meeting | null = null;
    currentUserId: number | null = null;

    constructor(
        private meetingsService: MeetingsService,
        private authService: AuthService,
        private router: Router
    ) {
        const user = this.authService.getUser();
        this.currentUserId = user?.id || null;
    }

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
        this.selectedMeeting = null;
    }

    onDateSelect(event: any) {
        console.log('onDateSelect called with event:', event);
        console.log('Current date before update:', this.date);
        this.date = event.value;
        console.log('Date after update:', this.date);
        this.updateSelectedDateMeetings();
        this.selectedMeeting = null;
    }

    selectMeeting(meeting: Meeting) {
        this.selectedMeeting = meeting;
    }

    viewMeetingDetails() {
        if (this.selectedMeeting) {
            this.router.navigate(['/meetings', this.selectedMeeting.id]);
            this.hide();
        }
    }

    private loadMeetings() {
        console.log('loadMeetings called');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        this.meetingsService.getUpcomingMeetings(today.toISOString()).subscribe({
            next: (meetings) => {
                console.log('Initial meetings loaded:', meetings);
                this.meetingsDates.clear();
                meetings.forEach(meeting => {
                    if (this.isRelevantMeeting(meeting)) {
                        const meetingDate = new Date(meeting.dateTime);
                        meetingDate.setHours(0, 0, 0, 0);
                        this.meetingsDates.add(meetingDate.toISOString());
                    }
                });
                console.log('Meeting dates set:', Array.from(this.meetingsDates));
                this.updateSelectedDateMeetings();
            },
            error: (error) => {
                console.error('Error fetching meetings:', error);
            }
        });
    }

    private updateSelectedDateMeetings() {
        console.log('updateSelectedDateMeetings called');
        if (!this.date) {
            console.log('No date selected, returning');
            return;
        }

        const selectedDate = new Date(this.date);
        selectedDate.setHours(0, 0, 0, 0);
        console.log('Selected date for meetings:', selectedDate);

        this.meetingsService.getUpcomingMeetings(selectedDate.toISOString()).subscribe({
            next: (meetings) => {
                console.log('Received meetings from service:', meetings);
                this.selectedDateMeetings = meetings.filter(meeting => {
                    const meetingDate = new Date(meeting.dateTime);
                    meetingDate.setHours(0, 0, 0, 0);
                    const isSameDate = meetingDate.getTime() === selectedDate.getTime();
                    const isRelevant = this.isRelevantMeeting(meeting);
                    console.log('Meeting:', meeting.title, 'isSameDate:', isSameDate, 'isRelevant:', isRelevant);
                    return isSameDate && isRelevant;
                });
                console.log('Filtered meetings:', this.selectedDateMeetings);
            },
            error: (error) => {
                console.error('Error fetching meetings for selected date:', error);
            }
        });
    }

    private isRelevantMeeting(meeting: Meeting): boolean {
        if (!this.currentUserId) {
            console.log('No current user ID');
            return false;
        }
        
        const isCreator = meeting.createdBy?.id === this.currentUserId;
        const isParticipant = meeting.participants?.some(participant => participant.id === this.currentUserId) || false;
        
        console.log('Meeting:', meeting.title, 'isCreator:', isCreator, 'isParticipant:', isParticipant);
        return isCreator || isParticipant;
    }

    getDateStyle(date: any) {
        console.log('getDateStyle called for date:', date);
        const currentDate = new Date(date.year, date.month, date.day);
        currentDate.setHours(0, 0, 0, 0);
        
        const hasMeeting = Array.from(this.meetingsDates).some(meetingDate => {
            const meeting = new Date(meetingDate);
            meeting.setHours(0, 0, 0, 0);
            return meeting.getTime() === currentDate.getTime();
        });

        console.log('Date:', currentDate, 'hasMeeting:', hasMeeting);
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
