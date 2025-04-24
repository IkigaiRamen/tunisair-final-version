import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { OrderListModule } from 'primeng/orderlist';
import { PickListModule } from 'primeng/picklist';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { Meeting } from '../../core/models/meeting.model';
import { MeetingsService } from '../../core/services/meetings.service';
@Component({
    selector: 'app-upcoming-meeting',
    standalone: true,
    imports: [CommonModule, DataViewModule, FormsModule, SelectButtonModule, PickListModule, OrderListModule, TagModule, ButtonModule],
    template: ` <div class="flex flex-col">
  <div class="card">
    <div class="font-semibold text-xl">Meetings</div>

    <p-dataview [value]="meetings" [layout]="layout">
      <ng-template #header>
        <div class="flex justify-end">
          <p-select-button [(ngModel)]="layout" [options]="options" [allowEmpty]="false">
            <ng-template #item let-option>
              <i class="pi" [ngClass]="{ 'pi-bars': option === 'list', 'pi-th-large': option === 'grid' }"></i>
            </ng-template>
          </p-select-button>
        </div>
      </ng-template>

      <!-- List Layout -->
      <ng-template #list let-items>
        <div class="flex flex-col">
          <div *ngFor="let meeting of items; let i = index">
            <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4" [ngClass]="{ 'border-t border-surface': i !== 0 }">
              <div class="flex flex-col md:flex-row justify-between flex-1 gap-6">
                <div class="flex flex-col">
                  <div class="text-lg font-medium text-surface-900">{{ meeting.title }}</div>
                  <div class="text-sm text-surface-600 mt-1">Scheduled: {{ meeting.dateTime | date:'medium' }}</div>
                  <div class="text-sm mt-1"><strong>Created By:</strong> {{ meeting.createdBy.username }}</div>
                  <div class="text-sm mt-1" *ngIf="meeting.agenda"><strong>Agenda:</strong> {{ meeting.agenda }}</div>
                </div>
                <div class="flex flex-col justify-center">
                  <p-button icon="pi pi-eye" label="View Details" styleClass="p-button-outlined p-button-sm"></p-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ng-template>

      <!-- Grid Layout -->
      <ng-template #grid let-items>
        <div class="grid grid-cols-12 gap-4">
          <div *ngFor="let meeting of items" class="col-span-12 sm:col-span-6 lg:col-span-4 p-2">
            <div class="p-6 border border-surface-200 bg-surface-0 rounded flex flex-col gap-4">
              <div>
                <div class="text-lg font-semibold">{{ meeting.title }}</div>
                <div class="text-sm text-surface-600">Scheduled: {{ meeting.dateTime | date:'medium' }}</div>
                <div class="text-sm"><strong>Created By:</strong> {{ meeting.createdBy.username }}</div>
                <div class="text-sm" *ngIf="meeting.objectives"><strong>Objectives:</strong> {{ meeting.objectives }}</div>
              </div>
              <p-button icon="pi pi-eye" label="View Details" styleClass="p-button-outlined p-button-sm w-full"></p-button>
            </div>
          </div>
        </div>
      </ng-template>
    </p-dataview>
  </div>
</div>
`,
    styles: `
        ::ng-deep {
            .p-orderlist-list-container {
                width: 100%;
            }
        }
    `,
    providers: [MeetingsService]
})
export class upcomingMeetings {
    
    layout: 'list' | 'grid' = 'list';

    options = ['list', 'grid'];

    meetings: Meeting[] = [];

   

    constructor(private meetingsService: MeetingsService) {}

    ngOnInit(): void {
        // Get current datetime in ISO format
    const start = new Date().toISOString();    
        // Call the service method to fetch upcoming meetings
        this.meetingsService.getUpcomingMeetings(start).subscribe(
          (meetings: Meeting[]) => {  // Explicitly define meetings as an array of Meeting
            this.meetings = meetings;
          },
          (error: any) => {  // Explicitly define error as any (you can specify a more detailed type if needed)
            console.error('Error fetching upcoming meetings:', error);
          }
        );
      }
    }