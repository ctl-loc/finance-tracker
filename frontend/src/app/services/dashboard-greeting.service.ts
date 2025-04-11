import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, catchError, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DashboardGreetingService {
  private readonly path = "/static/data/dashboard-greetings.json";
  constructor(private http: HttpClient) {}

  getGreeting(): Observable<string> {
    return this.http.get<string[]>(this.path + `?t=${Date.now()}`).pipe(
      map((greetings: string[]) => {
        const randomIndex = Math.floor(Math.random() * (greetings.length - 1));
        return greetings[randomIndex];
      }),
      catchError((error) => of("No greetings for you")),
    );
  }
}
