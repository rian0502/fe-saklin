import { Routes } from '@angular/router';

export const MACHINES_FEATURE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../pages/list/machines-list/machines-list').then((m) => m.MachinesList),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('../pages/form/machines-form/machines-form').then((m) => m.MachinesForm),
    data: { breadcrumb: 'New Machine' },
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('../pages/form/machines-form/machines-form').then((m) => m.MachinesForm),
    data: { breadcrumb: 'Edit Machine' },
  },
];
