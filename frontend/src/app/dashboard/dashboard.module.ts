import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ChartModule } from 'primeng/chart';

// Components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { TaskTrackingComponent } from './components/task-tracking/task-tracking.component';
import { MeetingOverviewComponent } from './components/meeting-overview/meeting-overview.component';
import { DocumentSummaryComponent } from './components/document-summary/document-summary.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    TimelineComponent,
    TaskTrackingComponent,
    MeetingOverviewComponent,
    DocumentSummaryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    CardModule,
    TimelineModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    ProgressSpinnerModule,
    ToastModule,
    ChartModule
  ],
  providers: [MessageService]
})
export class DashboardModule { } 