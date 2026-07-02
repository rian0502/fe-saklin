import { Routes } from '@angular/router';

export const USERS_FEATURE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../pages/list/users-list/users-list').then((m) => m.UsersList),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('../pages/form/users-form/users-form').then((m) => m.UsersForm),
    data: { breadcrumb: 'New User' },
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('../pages/form/users-form/users-form').then((m) => m.UsersForm),
    data: { breadcrumb: 'Edit User' },
  },
];
