import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth-guard';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('../layouts/admin/admin-layout/admin-layout').then(
                (m) => m.AdminLayout
            ),
        canActivate: [authGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'dashboard',
            },
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('../features/dashboard/pages/dashboard/dashboard').then(
                        (m) => m.Dashboard
                    ),
                data: { breadcrumb: 'Dashboard' },
            },
            {
                path: 'customers',
                loadChildren: () =>
                    import('../features/master/customers/routes/customers-feature.routes').then(
                        (m) => m.CUSTOMERS_FEATURE_ROUTES
                    ),
                data: { breadcrumb: 'Customers' },
            },
            {
                path: 'machine-types',
                loadChildren: () =>
                    import(
                        '../features/master/machine-types/routes/machine-types-feature.routes'
                    ).then((m) => m.MACHINE_TYPES_FEATURE_ROUTES),
                data: { breadcrumb: 'Machine Types' },
            },
            {
                path: 'machines',
                loadChildren: () =>
                    import('../features/master/machines/routes/machines-feature.routes').then(
                        (m) => m.MACHINES_FEATURE_ROUTES
                    ),
                data: { breadcrumb: 'Machines' },
            },
            {
                path: 'services',
                loadChildren: () =>
                    import('../features/master/services/routes/services-feature.routes').then(
                        (m) => m.SERVICES_FEATURE_ROUTES
                    ),
                data: { breadcrumb: 'Services' },
            },
            {
                path: 'inventory-items',
                loadChildren: () =>
                    import(
                        '../features/master/inventory-items/routes/inventory-items-feature.routes'
                    ).then((m) => m.INVENTORY_ITEMS_FEATURE_ROUTES),
                data: { breadcrumb: 'Inventory Items' },
            },
            {
                path: 'promotions',
                loadChildren: () =>
                    import('../features/master/promotions/routes/promotions-feature.routes').then(
                        (m) => m.PROMOTIONS_FEATURE_ROUTES
                    ),
                data: { breadcrumb: 'Promotions' },
            },
            {
                path: 'users',
                loadChildren: () =>
                    import('../features/master/users/routes/users-feature.routes').then(
                        (m) => m.USERS_FEATURE_ROUTES
                    ),
                data: { breadcrumb: 'Users' },
            },
        ],
    },
];
