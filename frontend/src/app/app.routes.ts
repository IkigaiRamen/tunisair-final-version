import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./auth/signup/signup.component').then(m => m.SignupComponent)
  },
  { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
  { path: 'meetings', loadChildren: () => import('./meetings/meetings.module').then(m => m.MeetingsModule) },
  { path: 'documents', loadChildren: () => import('./documents/documents.module').then(m => m.DocumentsModule) },
  { path: 'decisions', loadChildren: () => import('./decisions/decisions.module').then(m => m.DecisionsModule) },
  { path: 'tasks', loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule) },
  { path: 'notifications', loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsModule) },
  { path: 'reports', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule) },
  { path: '**', redirectTo: '' }
];

