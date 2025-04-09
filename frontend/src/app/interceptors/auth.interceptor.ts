import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpEvent,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable, catchError, switchMap, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const unprotectedRoutes = ["/auth"];

  // Clone request and add auth header
  const authReq = addTokenToRequest(req, authService.token);

  return next(authReq).pipe(
    catchError((error) => {
      // Only handle 401 for protected routes
      if (
        error.status === 401 &&
        !unprotectedRoutes.some((route) => req.url.startsWith(route))
      ) {
        return handle401Error(req, next, authService, router);
      }
      return throwError(() => error);
    }),
  );
};

function addTokenToRequest(
  req: HttpRequest<unknown>,
  token: string | null,
): HttpRequest<unknown> {
  return token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }, // Added Bearer prefix
      })
    : req;
}

function handle401Error(
  originalReq: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router,
): Observable<HttpEvent<unknown>> {
  // Check if we're already refreshing
  if (!authService.isRefreshing) {
    authService.isRefreshing = true;

    return authService.refreshToken().pipe(
      switchMap(() => {
        authService.isRefreshing = false;
        // Retry original request with new token
        const newAuthReq = addTokenToRequest(originalReq, authService.token);
        return next(newAuthReq);
      }),
      catchError((error) => {
        authService.isRefreshing = false;
        // If refresh fails, logout and redirect
        authService.logout();
        router.navigate(["/login"]);
        return throwError(() => error);
      }),
    );
  }

  // Wait while refreshing
  return authService.refreshCompleted$.pipe(
    switchMap(() => {
      const newAuthReq = addTokenToRequest(originalReq, authService.token);
      return next(newAuthReq);
    }),
  );
}
