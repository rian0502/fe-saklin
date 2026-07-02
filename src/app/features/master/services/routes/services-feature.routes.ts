import { Routes } from '@angular/router';

export const SERVICES_FEATURE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../pages/list/services-list/services-list').then((m) => m.ServicesList),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('../pages/form/services-form/services-form').then((m) => m.ServicesForm),
    data: { breadcrumb: 'New Service' },
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('../pages/form/services-form/services-form').then((m) => m.ServicesForm),
    data: { breadcrumb: 'Edit Service' },
  },
];
