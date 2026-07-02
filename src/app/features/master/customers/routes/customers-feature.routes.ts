import { Routes } from '@angular/router';

export const CUSTOMERS_FEATURE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../pages/list/customers-list/customers-list').then((m) => m.CustomersList),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('../pages/form/customers-form/customers-form').then((m) => m.CustomersForm),
    data: { breadcrumb: 'New Customer' },
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('../pages/form/customers-form/customers-form').then((m) => m.CustomersForm),
    data: { breadcrumb: 'Edit Customer' },
  },
];
