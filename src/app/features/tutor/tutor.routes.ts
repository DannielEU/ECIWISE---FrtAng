import { Routes } from '@angular/router';

/** Rutas del área de tutor. */
export const TUTOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./tutor-dashboard').then((m) => m.TutorDashboardComponent),
  },
  {
    path: 'schedule',
    loadComponent: () => import('./schedule/schedule').then((m) => m.TutorScheduleComponent),
  },
  {
    path: 'availability',
    loadComponent: () =>
      import('./availability/availability').then((m) => m.TutorAvailabilityComponent),
  },
  {
    path: 'requests',
    loadComponent: () => import('./requests/requests').then((m) => m.TutorRequestsComponent),
  },
  {
    path: 'history',
    loadComponent: () => import('./history/history').then((m) => m.TutorHistoryComponent),
  },
];
