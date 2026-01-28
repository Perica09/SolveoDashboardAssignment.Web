import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * HTTP Error Interceptor (Functional Interceptor for Angular 16+)
 * Handles HTTP errors globally and provides user-friendly error messages
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        errorMessage = `Client Error: ${error.error.message}`;
        console.error('Client-side error:', error.error.message);
      } else {
        // Backend error
        errorMessage = `Server Error: ${error.status} - ${error.message}`;
        console.error(`Backend returned code ${error.status}, body was:`, error.error);

        // Handle specific status codes
        switch (error.status) {
          case 400:
            errorMessage = 'Bad Request: Please check your input';
            break;
          case 401:
            errorMessage = 'Unauthorized: Please log in';
            break;
          case 403:
            errorMessage = 'Forbidden: You do not have permission';
            break;
          case 404:
            errorMessage = 'Not Found: The requested resource was not found';
            break;
          case 500:
            errorMessage = 'Internal Server Error: Please try again later';
            break;
          case 503:
            errorMessage = 'Service Unavailable: Please try again later';
            break;
        }
      }

      // Log to console for debugging
      console.error('HTTP Error:', {
        url: req.url,
        method: req.method,
        status: error.status,
        message: errorMessage,
        error: error
      });

      // Return error observable with user-friendly message
      return throwError(() => ({
        message: errorMessage,
        status: error.status,
        statusText: error.statusText,
        error: error.error
      }));
    })
  );
};
