import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

import {
  BehaviorSubject,
  catchError,
  first,
  Observable,
  Subject,
  tap,
} from "rxjs";
import {
  AuthReq,
  AuthRes,
  RegisterReq,
  RegisterRes,
} from "../interfaces/requests.interfaces";

@Injectable({ providedIn: "root" })
export class AuthService {
  public isRefreshing: boolean = false;
  public refreshCompleted$ = new Subject<void>();

  private token$ = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

  public get token(): string | null {
    return this.token$.value;
  }

  public isAuthenticated() {
    return !!this.token;
  }

  public hasRefreshToken() {
    const cookieService = inject(CookieService);
    return cookieService.check("refreshToken");
  }

  public clearTokens() {
    const cookieService = inject(CookieService);
    cookieService.delete("refreshToken");
    this.token$.next(null);
  }

  register(credentials?: RegisterReq): Observable<HttpResponse<RegisterRes>> {
    const endpoint = "/auth/register";
    return this.http.post<RegisterRes>(endpoint, credentials, {
      observe: "response", //observe the whole hhtp response, not only the object
    });
  }

  login(credentials?: AuthReq): Observable<HttpResponse<AuthRes>> {
    const endpoint = "/auth/login";

    return this.http
      .post<AuthRes>(endpoint, credentials, {
        observe: "response",
        withCredentials: true, // allow refreshToken cookie
      })
      .pipe(
        tap((response) => {
          if (response.status !== 200) return;
          if (response.body) {
            this.storeToken(response.body.token);
            console.info("[INFO] Token stored");
          }
          // refresh token is set on the cookies
        }),
      );
  }

  refreshToken(): Observable<AuthRes> {
    const endpoint = "/auth/refresh";
    return this.http
      .post<AuthRes>(endpoint, {}, { withCredentials: true })
      .pipe(
        tap((response) => {
          this.storeToken(response.token);
          console.info("[INFO] token refreshed");
          // tell user function to set isRefreshing to false
          this.refreshCompleted$.next();
        }),
      );
  }

  logout() {
    console.warn("[WARN] Logging out");
    this.token$.next(null);
  }

  private storeToken(token: string) {
    this.token$.next(token);
  }
}
