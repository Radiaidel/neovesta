import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { AuthService } from "../../services/auth.service"
import { Router } from "@angular/router"
import type { User } from "../../models/user.model"

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <div class="flex-shrink-0 flex items-center">
                <span class="font-bold text-xl">UISOCIAL</span>
              </div>
            </div>
            <div class="flex items-center">
              <div class="ml-3 relative">
                <div>
                  <button (click)="logout()" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div class="py-10">
        <header>
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>
        </header>
        <main>
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="bg-white shadow rounded-lg p-6 mt-6">
              <h2 class="text-lg font-medium text-gray-900 mb-4">Welcome, {{ user?.firstName || 'User' }}!</h2>
              <p class="text-gray-600">You are logged in as: {{ user?.role }}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
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

