import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import {  meetings } from './meetings/meetings';
import { AdminCrudComponent } from './admin/adminCrud';
import { upcomingMeetings } from './meetings/upcomingMeetings';
import { pastMeetings } from './meetings/pastMeetings';
export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'admin', component: AdminCrudComponent },
    { path: '**', redirectTo: '/notfound' },
] as Routes;
