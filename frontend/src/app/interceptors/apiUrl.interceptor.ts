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
import { environment } from "../../environment/environment";

export const apiUrlInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  const skipPath = ["/static"];
  // Clone request and add auth header
  const apiUrl = environment.apiUrl;

  for (const path of skipPath) {
    if (req.url.startsWith(path)) {
      return next(req);
    }
  }

  const passedReq = req.clone({
    url: apiUrl + req.url,
  });
  return next(passedReq);
};
