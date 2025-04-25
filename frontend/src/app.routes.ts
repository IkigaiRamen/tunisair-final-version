import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { AuthGuard } from './app/core/guards/auth.guard';
import { ProfileComponent } from './app/pages/profile/profile.component';

import { meetings } from './app/pages/meetings/meetings';
import { upcomingMeetings } from './app/pages/meetings/upcomingMeetings';
import { pastMeetings } from './app/pages/meetings/pastMeetings';
import { MeetingDetailsComponent } from './app/pages/meetings/meetingDetails';
import { AllDocumentsComponent } from './app/pages/documents/all-documents';
import { DocumentsByMeetingComponent } from './app/pages/documents/documents-by-meeting';
import { UploadDocumentComponent } from './app/pages/documents/upload-document';
import { TasksDashboardComponent } from './app/pages/tasks/tasks-dashboard';
import { DecisionsLogComponent } from './app/pages/decisions/decisions-log';
import { MeetingSummariesComponent } from './app/pages/reports/meeting-summaries';
import { TaskProgressComponent } from './app/pages/reports/task-progress';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: Dashboard },
            { path: 'documentation', component: Documentation },
            { path: 'profile', component: ProfileComponent },
            {
                path: 'meetings',
                children: [
                    { path: 'new', component: meetings },
                    { path: 'upcoming', component: upcomingMeetings },
                    { path: 'past', component: pastMeetings },
                    { path: ':id', component: MeetingDetailsComponent }
                ]
            },
            {
                path: 'documents',
                children: [
                    { path: '', component: AllDocumentsComponent },
                    { path: 'by-meeting', component: DocumentsByMeetingComponent },
                    { path: 'upload', component: UploadDocumentComponent },
                ]
            }, 
            {
                path: 'decisions-tasks',
                children: [
                    { path: 'tasks', component: TaskProgressComponent },
                    { path: 'decisions', component: DecisionsLogComponent },
                ]
            },
            {
                path: 'reports',
                children: [
                    { path: 'meeting-summaries', component: MeetingSummariesComponent },
                    { path: 'task-progress', component: TaskProgressComponent },
                ]
            },   
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/auth/login' }
];


