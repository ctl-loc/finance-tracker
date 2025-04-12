import { Routes } from "@angular/router";
import { authGuard } from "./guards/auth.guard";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { DashboardComponent } from "./containers/dashboard/dashboard.component";

export const routes: Routes = [
  {
    // redirect ro login
    path: "",
    title: "root",
    redirectTo: "auth/login",
    pathMatch: "full",
  },
  {
    path: "auth/login",
    title: "Login",
    component: LoginComponent,
    pathMatch: "full",
  },
  {
    path: "auth/register",
    title: "Register",
    component: RegisterComponent,
  },
  {
    path: "dashboard",
    title: "Dashboard",
    component: DashboardComponent,
    canActivate: [authGuard],
  },
];
