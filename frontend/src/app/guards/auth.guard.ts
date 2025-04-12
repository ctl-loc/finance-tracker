import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { map, catchError, switchMap, of, tap } from "rxjs";

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Immediate check for existing token
  if (auth.isAuthenticated()) {
    return true;
  }

  // Refresh token flow
  return handleRefreshFlow(auth, router, state.url);
};

function handleRefreshFlow(
  auth: AuthService,
  router: Router,
  originalUrl: string,
) {
  // If refresh token exists
  if (auth.hasRefreshToken()) {
    // Handle concurrent refresh attempts
    if (auth.isRefreshing) {
      return auth.refreshCompleted$.pipe(
        switchMap(() => retryAuthCheck(auth, router, originalUrl)),
      );
    }

    // Start new refresh attempt
    auth.isRefreshing = true;

    return auth.refreshToken().pipe(
      switchMap(() => retryAuthCheck(auth, router, originalUrl)),
      catchError(() => {
        auth.clearTokens();
        return redirectToLogin(router, originalUrl);
      }),
      tap(() => {
        auth.isRefreshing = false;
      }),
    );
  }

  // No refresh token available
  return redirectToLogin(router, originalUrl);
}

function retryAuthCheck(
  auth: AuthService,
  router: Router,
  originalUrl: string,
) {
  return auth.isAuthenticated()
    ? of(true)
    : redirectToLogin(router, originalUrl);
}

function redirectToLogin(router: Router, originalUrl: string) {
  // Preserve original URL for redirect after login
  return of(
    router.createUrlTree(["/auth/login"], {
      queryParams: { returnUrl: originalUrl },
    }),
  );
}
