import { Routes } from '@angular/router';

export const MACHINE_TYPES_FEATURE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../pages/list/machine-types-list/machine-types-list').then(
        (m) => m.MachineTypesList
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('../pages/form/machine-types-form/machine-types-form').then(
        (m) => m.MachineTypesForm
      ),
    data: { breadcrumb: 'New Machine Type' },
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('../pages/form/machine-types-form/machine-types-form').then(
        (m) => m.MachineTypesForm
      ),
    data: { breadcrumb: 'Edit Machine Type' },
  },
];
