import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth-guard';

export const POS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('../layouts/pos/pos-layout/pos-layout').then(
                (m) => m.PosLayout
            ),
        canActivate: [authGuard],
    },
];
