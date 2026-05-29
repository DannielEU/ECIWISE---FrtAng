import { Routes } from '@angular/router';
import { SectionPlaceholderComponent } from '../../shared/ui/section-placeholder/section-placeholder';

/** Rutas del área de tutor. Las secciones se completan en la Fase 3. */
export const TUTOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./tutor-dashboard').then((m) => m.TutorDashboardComponent),
  },
  {
    path: 'schedule',
    component: SectionPlaceholderComponent,
    data: { titleKey: 'nav.schedule', icon: 'schedule' },
  },
  {
    path: 'availability',
    component: SectionPlaceholderComponent,
    data: { titleKey: 'nav.availability', icon: 'availability' },
  },
  {
    path: 'requests',
    component: SectionPlaceholderComponent,
    data: { titleKey: 'nav.requests', icon: 'requests' },
  },
  {
    path: 'history',
    component: SectionPlaceholderComponent,
    data: { titleKey: 'nav.history', icon: 'history' },
  },
];
