import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { DynamicDialogModule } from 'primeng/dynamicdialog';

// Components
import { MeetingListComponent } from './components/meeting-list/meeting-list.component';
import { MeetingFormComponent } from './components/meeting-form/meeting-form.component';
import { MeetingDetailsComponent } from './components/meeting-details/meeting-details.component';
import { MeetingCalendarComponent } from './components/meeting-calendar/meeting-calendar.component';

const routes: Routes = [
  { path: '', component: MeetingListComponent },
  { path: 'calendar', component: MeetingCalendarComponent }
];

@NgModule({
  declarations: [
    MeetingListComponent,
    MeetingFormComponent,
    MeetingDetailsComponent,
    MeetingCalendarComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    CardModule,
    ButtonModule,
    TableModule,
    DropdownModule,
    CalendarModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    MultiSelectModule,
    ChipModule,
    InputTextModule,
    InputTextareaModule,
    FullCalendarModule,
    DynamicDialogModule
  ],
  exports: [
    MeetingListComponent,
    MeetingFormComponent,
    MeetingDetailsComponent,
    MeetingCalendarComponent
  ]
})
export class MeetingModule { } 