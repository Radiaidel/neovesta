import { Component, type OnDestroy, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { type Toast, ToastService } from "../../../services/toast.service"
import { Subscription, delay, of, tap } from "rxjs"
import { animate, state, style, transition, trigger } from "@angular/animations"

@Component({
  selector: "app-toast",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      @for (toast of toasts; track toast.id) {
        <div 
          [@fadeInOut]
          class="p-4 rounded-lg shadow-lg flex items-center gap-3 text-white"
          [ngClass]="{
            'bg-green-600': toast.type === 'success',
            'bg-red-600': toast.type === 'error',
            'bg-blue-600': toast.type === 'info',
            'bg-amber-600': toast.type === 'warning'
          }"
        >
          <div class="flex-1">{{ toast.message }}</div>
          <button 
            (click)="removeToast(toast.id)" 
            class="text-white hover:text-gray-200 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  animations: [
    trigger("fadeInOut", [
      state(
        "void",
        style({
          opacity: 0,
          transform: "translateX(20px)",
        }),
      ),
      transition("void => *", [
        animate(
          "300ms ease-out",
          style({
            opacity: 1,
            transform: "translateX(0)",
          }),
        ),
      ]),
      transition("* => void", [
        animate(
          "300ms ease-in",
          style({
            opacity: 0,
            transform: "translateX(20px)",
          }),
        ),
      ]),
    ]),
  ],
})
export class ToastComponent implements OnInit, OnDestroy {
  private toastService = inject(ToastService)
  private subscription = new Subscription()
  toasts: Toast[] = []

  ngOnInit() {
    this.subscription.add(
      this.toastService.toasts.subscribe((toast) => {
        this.toasts.push(toast)

        // Auto-remove toast after 5 seconds
        of(null)
          .pipe(
            delay(5000),
            tap(() => this.removeToast(toast.id)),
          )
          .subscribe()
      }),
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter((t) => t.id !== id)
  }
}

