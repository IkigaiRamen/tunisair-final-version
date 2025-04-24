import { Component } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MeetingsService } from '../../core/services/meetings.service';
import { Meeting } from '../../core/models/meeting.model';

@Component({
    selector: 'app-past-meetings',
    standalone: true,
    imports: [CommonModule, TimelineModule, ButtonModule, CardModule],
    template: `
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-full">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Past Meetings Timeline</div>
                <p-timeline [value]="meetings" align="alternate" styleClass="customized-timeline">
                    <ng-template #marker let-meeting>
                        <span class="flex w-8 h-8 items-center justify-center text-white rounded-full z-10 shadow-sm bg-blue-500">
                            <i class="pi pi-calendar"></i>
                        </span>
                    </ng-template>
                    <ng-template #content let-meeting>
                        <p-card [header]="meeting.title" [subheader]="formatDate(meeting.dateTime)">
                            <p><strong>Agenda:</strong> {{ meeting.agenda }}</p>
                            <p><strong>Objectives:</strong> {{ meeting.objectives }}</p>
                            <p-button label="Details" [text]="true" />
                        </p-card>
                    </ng-template>
                </p-timeline>
            </div>
        </div>
    </div>
    `,
    providers: [MeetingsService]
})
export class pastMeetings {
    meetings: Meeting[] = [];

    constructor(private meetingsService: MeetingsService) {}

    ngOnInit(): void {
        const start = new Date().toISOString();
        this.meetingsService.getPastMeetings(start).subscribe(
            (meetings: Meeting[]) => {
                this.meetings = meetings;
            },
            (error: any) => {
                console.error('Error fetching past meetings:', error);
            }
        );
    }

    formatDate(dateTime: string): string {
        const date = new Date(dateTime);
        return date.toLocaleString(); // Adjust formatting as needed
    }
}
