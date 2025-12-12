import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';

export const employeesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./employee-dashboard/employee-dashboard.component').then(m => m.EmployeeDashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'add',
    loadComponent: () => import('./employee-form/employee-form.component').then(m => m.EmployeeFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./employee-form/employee-form.component').then(m => m.EmployeeFormComponent),
    canActivate: [authGuard]
  },
  {
    path: ':id',
    loadComponent: () => import('./employee-detail/employee-detail.component').then(m => m.EmployeeDetailComponent),
    canActivate: [authGuard]
  }
];

