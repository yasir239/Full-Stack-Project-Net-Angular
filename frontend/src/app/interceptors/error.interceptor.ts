import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'An unexpected error occurred.';

      if (error.status === 0) {
        message = 'Unable to connect to the server. Please check your connection.';
      } else if (error.status === 400) {
        if (error.error?.errors) {
          const validationErrors = Object.values(error.error.errors).flat();
          message = validationErrors.join(' ');
        } else {
          message = error.error?.detail || 'Invalid request. Please check your input.';
        }
      } else if (error.status === 404) {
        message = error.error?.detail || 'The requested resource was not found.';
      } else if (error.status >= 500) {
        message = 'A server error occurred. Please try again later.';
      }

      notification.error(message);
      return throwError(() => error);
    })
  );
};
