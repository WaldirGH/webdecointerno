import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then(m => m.Login)
    },
    {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
        children: [
            { path: '', redirectTo: 'pedidos', pathMatch: 'full' },
            {
                path: 'productos',
                loadComponent: () => import('./pages/productos/productos').then(m => m.Productos)
            },
            {
                path: 'categorias',
                loadComponent: () => import('./pages/categorias/categorias').then(m => m.Categorias)
            },
            {
                path: 'proveedores',
                loadComponent: () => import('./pages/proveedores/proveedores').then(m => m.Proveedores)
            },
            {
                path: 'pedidos',
                loadComponent: () => import('./pages/pedidos/pedidos').then(m => m.Pedidos)
            },
            {
                path: 'inventario',
                loadComponent: () => import('./pages/inventario/inventario').then(m => m.Inventario)
            },
            {
                path: 'usuarios',
                canActivate: [adminGuard],
                loadComponent: () => import('./pages/usuarios/usuarios').then(m => m.Usuarios)
            }
        ]
    },
    { path: '**', redirectTo: 'login' }
];
