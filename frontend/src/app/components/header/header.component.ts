import { Component } from "@angular/core";
import { DashboardGreetingService } from "../../services/dashboard-greeting.service";
import { Subscription } from "rxjs";
import { MatButtonModule, MatIconButton } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbar } from "@angular/material/toolbar";

@Component({
  selector: "app-header",
  imports: [MatButtonModule, MatIconModule, MatToolbar],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent {
  public greetingMessage = "Loading...";
  private greeting$!: Subscription;

  constructor(private greetingService: DashboardGreetingService) {
    this.loadGreeting();
  }

  private loadGreeting(): void {
    this.greeting$ = this.greetingService.getGreeting().subscribe({
      next: (message) => (this.greetingMessage = message),
      error: () => (this.greetingMessage = "Hello!"),
    });
  }
}
