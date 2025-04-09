import { Router } from "@angular/router";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HttpResponse } from "@angular/common/http";
import { AuthService } from "../../services/auth.service";
import { AuthReq, AuthRes } from "../../interfaces/requests.interfaces";

@Component({
  selector: "app-login",
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  public loginForm: FormGroup;
  public isProcessing: boolean = false;
  public errorMessage?: string;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      username: [""],
      password: [""],
      fields: this.fb.array([]),
    });
  }

  public submitForm() {
    if (this.isProcessing) return; // can't spam the button

    // reset error and start processing
    this.isProcessing = true;
    this.errorMessage = undefined;

    const credentials = this.loginForm.value as AuthReq;
    this.auth.login(credentials).subscribe({
      next: (response: HttpResponse<AuthRes>) => {
        // on valid response stop processing message and do
        this.isProcessing = false;

        if (response.status !== 200 || !response.body) return;
        // server response is 200, logged in
        this.router.navigate(["dashboard"]);
      },
      error: (err) => {
        this.isProcessing = false;
        switch (err.status) {
          case 404:
            this.errorMessage = "This user does not exist";
            break;
          case 422:
            this.errorMessage = "Please provide a username AND a password";
            break;
          case 401:
            this.errorMessage = "Invalid credentials...";
            break;
          default:
            console.error(err);
        }
      },
    });
  }

  public goToRegister() {
    this.router.navigate(["/auth/register"]);
  }
}
