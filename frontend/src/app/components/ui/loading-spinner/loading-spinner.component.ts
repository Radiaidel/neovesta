import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-loading-spinner",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center">
      <div class="w-12 h-12 border-4 border-gray-300 dark:border-gray-600 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
    </div>
  `,
})
export class LoadingSpinnerComponent {}

