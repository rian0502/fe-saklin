import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'auth/login',
    },

    {
        path: 'auth',
        loadChildren: () =>
            import('./routes/auth.routes').then((m) => m.AUTH_ROUTES),
    },

    // {
    //     path: 'admin',
    //     loadChildren: () =>
    //         import('./routes/admin.routes').then((m) => m.ADMIN_ROUTES),
    // },

    // {
    //     path: 'pos',
    //     loadChildren: () =>
    //         import('./routes/pos.routes').then((m) => m.POS_ROUTES),
    // },

    {
        path: '**',
        redirectTo: 'auth/login',
    },
];