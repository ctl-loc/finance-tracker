import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {
  BehaviorSubject,
  catchError,
  first,
  Observable,
  of,
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

  register(credentials?: RegisterReq): Observable<HttpResponse<RegisterRes>> {
    const endpoint = "/auth/register";
    return this.http.post<RegisterRes>(endpoint, credentials, {
      observe: "response", //observe the whole hhtp response, not only the object
    });
  }

  login(credentials?: AuthReq): Observable<HttpResponse<AuthRes>> {
    const endpoint = "/auth/login";

    return this.http
      .post<AuthRes>(endpoint, credentials, { observe: "response" })
      .pipe(
        tap((response) => {
          if (response.status !== 200) return;
          if (response.body) this.storeToken(response.body.token);
          // refresh token is set on the cookies
        }),
      );
  }

  refreshToken(): Observable<AuthRes> {
    const endpoint = "/auth/refresh";
    return this.http.post<AuthRes>(endpoint, {}).pipe(
      tap((response) => {
        this.storeToken(response.token);
        // tell user function to set isRefreshing to false
        this.refreshCompleted$.next();
      }),
    );
  }

  logout() {
    this.token$.next(null);
  }

  private storeToken(token: string) {
    this.token$.next(token);
  }
}
