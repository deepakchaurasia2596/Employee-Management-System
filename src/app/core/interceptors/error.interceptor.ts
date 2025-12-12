import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            errorMessage = 'Bad Request: Invalid data provided';
            break;
          case 401:
            errorMessage = 'Unauthorized: Please login again';
            break;
          case 403:
            errorMessage = 'Forbidden: You do not have permission';
            break;
          case 404:
            errorMessage = 'Not Found: Resource not found';
            break;
          case 500:
            errorMessage = 'Server Error: Please try again later';
            break;
          default:
            errorMessage = `Error: ${error.message}`;
        }
      }

      console.error('HTTP Error:', errorMessage);
      try {
        toast.showError(errorMessage);
      } catch (e) {
        // nothing
      }
      return throwError(() => new Error(errorMessage));
    })
  );
};
