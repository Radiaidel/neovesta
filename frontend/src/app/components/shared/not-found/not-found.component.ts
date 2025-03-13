import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-not-found",
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-[#E8E1D7] to-[#9BA8A5]">
      <!-- Container for content with subtle shadow and rounded corners -->
      <div class="bg-white p-10 rounded-xl shadow-lg max-w-lg w-full animate-slideIn">
        <!-- Decorative line element using primary color -->
        <div class="w-20 h-1 bg-[#C5A47E] mx-auto mb-8 rounded-full"></div>
        
        <!-- Large, bold 404 number with a special design -->
        <div class="relative mb-8">
          <span class="text-9xl font-extrabold text-[#0A1C26]/5">404</span>
          <h1 class="text-4xl font-bold text-[#0A1C26] absolute inset-0 flex items-center justify-center">
            PAGE NOT FOUND
          </h1>
        </div>
        
        <!-- Message with secondary color -->
        <p class="text-lg text-[#2D4E5B] mb-10 max-w-md mx-auto">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        
        <!-- Actions with improved styling -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a routerLink="/"
             class="px-6 py-3 bg-[#2D4E5B] text-white rounded-lg shadow-md
                    hover:bg-[#0A1C26] transition-all duration-300 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Home
          </a>
          <button (click)="goBack()"
             class="px-6 py-3 bg-[#C5A47E] text-white rounded-lg shadow-md
                    hover:bg-[#A08C6C] transition-all duration-300 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            Go Back
          </button>
        </div>
        
        <!-- Decorative elements -->
        <div class="flex justify-center mt-10">
          <div class="w-2 h-2 rounded-full bg-[#C5A47E] mx-1"></div>
          <div class="w-2 h-2 rounded-full bg-[#2D4E5B] mx-1"></div>
          <div class="w-2 h-2 rounded-full bg-[#6B7D86] mx-1"></div>
        </div>
      </div>
      
      <!-- Footer with subtle text -->
      <p class="text-[#0A1C26] mt-8 text-sm">
        Need help? <a href="/contact" class="text-[#6B7D86] hover:underline font-medium">Contact support</a>
      </p>
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-slideIn {
      animation: slideIn 0.8s ease-out forwards;
    }
  `]
})
export class NotFoundComponent {
  goBack(): void {
    window.history.back();
  }
}