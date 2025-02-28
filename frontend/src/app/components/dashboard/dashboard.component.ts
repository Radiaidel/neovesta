import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { AuthService } from "../../services/auth.service"
import { Router } from "@angular/router"
import type { User } from "../../models/user.model"
import { HeaderComponent } from "../shared/header/header.component";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent {
  private authService = inject(AuthService)
  private router = inject(Router)

  user: User | null = null

  constructor() {
    this.authService.currentUser$.subscribe((user) => {
      this.user = user
    })
  }

  logout(): void {
    this.authService.logout()
  }
}

