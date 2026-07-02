import { Routes } from '@angular/router';

export const INVENTORY_ITEMS_FEATURE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../pages/list/inventory-items-list/inventory-items-list').then(
        (m) => m.InventoryItemsList
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('../pages/form/inventory-items-form/inventory-items-form').then(
        (m) => m.InventoryItemsForm
      ),
    data: { breadcrumb: 'New Inventory Item' },
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('../pages/form/inventory-items-form/inventory-items-form').then(
        (m) => m.InventoryItemsForm
      ),
    data: { breadcrumb: 'Edit Inventory Item' },
  },
];
