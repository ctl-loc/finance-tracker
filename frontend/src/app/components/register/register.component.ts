import { Router } from "@angular/router";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HttpResponse } from "@angular/common/http";
import { AuthService } from "../../services/auth.service";
import { RegisterReq, RegisterRes } from "../../interfaces/requests.interfaces";

@Component({
  selector: "app-register",
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.css",
})
export class RegisterComponent {
  public registerForm: FormGroup;
  public isProcessing: boolean = false;
  public errorMessage?: string;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      username: [""],
      email: [""],
      password: [""],
      fields: this.fb.array([]),
    });
  }

  submitForm() {
    if (this.isProcessing) return; // can't spam the button

    this.isProcessing = true;
    this.errorMessage = undefined;

    const credentials = this.registerForm.value as RegisterReq;
    this.auth.register(credentials).subscribe({
      next: (response: HttpResponse<RegisterRes>) => {
        this.isProcessing = false;
        // user created successfully
        if (response.status === 201) {
          this.isProcessing = false;
          this.router.navigate(["/auth/login"]);
        } else if (response.status === 409) {
          this.errorMessage = "This user already exists";
        } else {
          // can't create a user ? fuck you
          window.close();
        }
      },
      error: (err) => {
        console.error("Error Status:", err.status);
        console.error("Error Body:", err.error);
      },
    });
  }

  public goToLogin() {
    this.router.navigate(["/auth/login"]);
  }
}
