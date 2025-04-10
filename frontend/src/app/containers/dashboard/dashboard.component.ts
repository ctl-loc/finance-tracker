import { Component } from "@angular/core";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { ChartComponent } from "../../components/chart/chart.component";
import { HeaderComponent } from "../../components/header/header.component";
import { NewTransactionComponent } from "../../components/new-transaction/new-transaction.component";
import { RecentTransactionComponent } from "../recent-transaction/recent-transaction.component";
import { BankAccountComponent } from "../../components/bank-account/bank-account.component";

@Component({
  selector: "app-dashboard",
  imports: [
    SideBarComponent,
    ChartComponent,
    HeaderComponent,
    NewTransactionComponent,
    RecentTransactionComponent,
    BankAccountComponent,
  ],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css",
})
export class DashboardComponent {}
