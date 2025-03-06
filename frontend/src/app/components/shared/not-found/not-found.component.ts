import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-not-found",
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <img src="assets/images/404.svg" alt="Page Not Found" class="w-72 mb-6 animate-bounce" />
      <h1 class="text-5xl font-extrabold text-gray-800 mb-4">Oops! 404</h1>
      <p class="text-lg text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
      <a routerLink="/" class="px-5 py-3 bg-blue-800 text-white rounded-lg shadow-md hover:bg-primary-700 transition">
        Return Home
      </a>
    </div>
  `,
})
export class NotFoundComponent {}
