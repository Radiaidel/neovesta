import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ToastService, Toast } from "../../../services/toast.service";
import { Subscription } from "rxjs";
import { animate, state, style, transition, trigger } from "@angular/animations";

@Component({
  selector: "app-toast",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-6 right-6 flex flex-col gap-3 max-w-md z-[9999]">
      @for (toast of toasts; track toast.id) {
        <div 
          [@fadeInOut]
          class="rounded-lg shadow-lg p-5 flex items-center max-w-md transform transition-all border-l-4"
          [ngClass]="{
            'bg-green-50 border-green-500 text-green-800': toast.type === 'success',
            'bg-blue-50 border-blue-500 text-blue-800': toast.type === 'info',
            'bg-yellow-50 border-yellow-500 text-yellow-800': toast.type === 'warning',
            'bg-red-50 border-red-500 text-red-800': toast.type === 'error'
          }"
        >
          <div class="flex items-center">
            <!-- Icon -->
            <div class="mr-3">
              @if (toast.type === 'success') {
                <svg class="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              } @else if (toast.type === 'info') {
                <svg class="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              } @else if (toast.type === 'warning') {
                <svg class="h-6 w-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              } @else if (toast.type === 'error') {
                <svg class="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              }
            </div>
            <!-- Message -->
            <div class="flex-1 text-sm font-medium">{{ toast.message }}</div>
            <!-- Close button -->
            <button 
              (click)="removeToast(toast.id)" 
              class="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      }
    </div>
  `,
  animations: [
    trigger("fadeInOut", [
      state("void", style({ opacity: 0, transform: "translateY(-10px)" })),
      transition("void => *", animate("200ms ease-out", style({ opacity: 1, transform: "translateY(0)" }))),
      transition("* => void", animate("200ms ease-in", style({ opacity: 0, transform: "translateY(-10px)" }))),
    ]),
  ],
})
export class ToastComponent implements OnInit, OnDestroy {
  private toastService = inject(ToastService);
  private subscription = new Subscription();
  toasts: Toast[] = [];

  ngOnInit() {
    this.subscription.add(
      this.toastService.toasts.subscribe((toast) => {
        this.toasts.push(toast);
        setTimeout(() => this.removeToast(toast.id), 4000);
      })
    );
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
