// Angular imports
import { Routes } from '@angular/router';

// Internal imports
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/employees',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'employees',
    loadChildren: () => import('./employees/employees.routes').then(m => m.employeesRoutes),
    canActivate: [authGuard]
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./shared/components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: '**',
    redirectTo: '/employees'
  }
];
