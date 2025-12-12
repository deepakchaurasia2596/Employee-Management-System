import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../../core/models/employee.model';
import { appConstants } from '../constants/app.constants';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
        router.navigate([appConstants.routes.Login]);
      return false;
    }

    if (authService.hasAnyRole(allowedRoles)) {
      return true;
    }

      router.navigate([appConstants.routes.Unauthorized]);
    return false;
  };
};
