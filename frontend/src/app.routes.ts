import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';

import { meetings } from './app/pages/meetings/meetings';
import { upcomingMeetings } from './app/pages/meetings/upcomingMeetings';
import { pastMeetings } from './app/pages/meetings/pastMeetings';
import { MeetingDetailsComponent } from './app/pages/meetings/meetingDetails';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'documentation', component: Documentation },
            {
                path: 'meetings',
                children: [
                    { path: 'new', component: meetings },
                    { path: 'upcoming', component: upcomingMeetings },
                    { path: 'past', component: pastMeetings },
                    { path: ':id', component: MeetingDetailsComponent }
                ]
            },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
