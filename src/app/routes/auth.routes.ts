import { Routes } from '@angular/router';
import { guestGuard } from '../core/guards/guest-guard';

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('../layouts/auth/auth-layout/auth-layout').then(
                (m) => m.AuthLayout
            ),
        canActivate: [guestGuard],
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('../features/auth/routes/auth-feature.routes').then(
                        (m) => m.AUTH_FEATURE_ROUTES
                    ),
            },
        ],
    },
];