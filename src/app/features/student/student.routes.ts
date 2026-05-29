import { Routes } from '@angular/router';
import { SectionPlaceholderComponent } from '../../shared/ui/section-placeholder/section-placeholder';

/** Rutas del área de estudiante. Las secciones se completan en la Fase 2. */
export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./student-dashboard').then((m) => m.StudentDashboardComponent),
  },
  {
    path: 'monitorias',
    component: SectionPlaceholderComponent,
    data: { titleKey: 'nav.monitorias', icon: 'monitorias' },
  },
  {
    path: 'materials',
    component: SectionPlaceholderComponent,
    data: { titleKey: 'nav.materials', icon: 'materials' },
  },
  {
    path: 'games',
    component: SectionPlaceholderComponent,
    data: { titleKey: 'nav.games', icon: 'games' },
  },
  {
    path: 'study',
    component: SectionPlaceholderComponent,
    data: { titleKey: 'nav.study', icon: 'study' },
  },
  {
    path: 'tasks',
    component: SectionPlaceholderComponent,
    data: { titleKey: 'nav.tasks', icon: 'tasks' },
  },
  {
    path: 'profile',
    component: SectionPlaceholderComponent,
    data: { titleKey: 'nav.profile', icon: 'profile' },
  },
];
