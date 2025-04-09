import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);

  return auth.token !== null;
};
