import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { authInterceptor } from "./interceptors/auth.interceptor";
import { routes } from "./app.routes";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { apiUrlInterceptor } from "./interceptors/apiUrl.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, apiUrlInterceptor])),
  ],
};
