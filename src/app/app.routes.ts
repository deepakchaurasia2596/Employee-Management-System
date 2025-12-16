// Angular imports
import { Routes } from '@angular/router';

// Guards
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

// Models
import { UserRole } from './core/models/employee.model';

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

  // Employee Dashboard (ALL authenticated users)
  {
    path: 'employees',
    loadComponent: () => import('../app/employees/employee-dashboard/employee-dashboard.component').then(m => m.EmployeeDashboardComponent),
    canActivate: [authGuard]
  },

  // View Employee (ALL roles)
  {
    path: 'employees/view/:id',
    loadComponent: () => import('../app/employees/employee-detail/employee-detail.component').then(m => m.EmployeeDetailComponent),
    canActivate: [authGuard]
  },

  // Edit Employee (ADMIN + MANAGER only)
  {
    path: 'employees/edit/:id',
    loadComponent: () => import('../app/employees/employee-form/employee-form.component').then(m => m.EmployeeFormComponent),
    canActivate: [authGuard, roleGuard([UserRole.ADMIN, UserRole.MANAGER])]
  },

  // Add Employee (ADMIN only)
  {
    path: 'employees/add',
    loadComponent: () => import('../app/employees/employee-form/employee-form.component').then(m => m.EmployeeFormComponent),
    canActivate: [authGuard, roleGuard([UserRole.ADMIN])]
  },

  // Unauthorized
  {
    path: 'unauthorized',
    loadComponent: () => import('./shared/components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },

  // Wildcard
  {
    path: '**',
    redirectTo: '/employees'
  }
];
