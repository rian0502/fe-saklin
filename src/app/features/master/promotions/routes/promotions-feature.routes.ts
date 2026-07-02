import { Routes } from '@angular/router';

export const PROMOTIONS_FEATURE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../pages/list/promotions-list/promotions-list').then((m) => m.PromotionsList),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('../pages/form/promotions-form/promotions-form').then((m) => m.PromotionsForm),
    data: { breadcrumb: 'New Promotion' },
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('../pages/form/promotions-form/promotions-form').then((m) => m.PromotionsForm),
    data: { breadcrumb: 'Edit Promotion' },
  },
];
