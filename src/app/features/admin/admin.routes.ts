import { Routes } from '@angular/router';
import { SectionPlaceholderComponent } from '../../shared/ui/section-placeholder/section-placeholder';

/** Rutas del área de administración. Gestión de usuarios en la Fase 4. */
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-dashboard').then((m) => m.AdminDashboardComponent),
  },
  {
    path: 'users',
    component: SectionPlaceholderComponent,
    data: { titleKey: 'nav.users', icon: 'users' },
  },
];
