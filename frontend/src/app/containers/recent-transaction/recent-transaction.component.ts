import { Component } from "@angular/core";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: "app-recent-transaction",
  imports: [MatCardModule],
  templateUrl: "./recent-transaction.component.html",
  styleUrl: "./recent-transaction.component.css",
})
export class RecentTransactionComponent {}
