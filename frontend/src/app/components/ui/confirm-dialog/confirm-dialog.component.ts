import { Component, EventEmitter, Input, Output } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-confirm-dialog",
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div 
          class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 animate-in fade-in zoom-in duration-300"
          (click)="$event.stopPropagation()"
        >
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ title }}</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-6">{{ message }}</p>
          
          <div class="flex justify-end gap-3">
            <button 
              (click)="onCancel()"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {{ cancelText }}
            </button>
            <button 
              (click)="onConfirm()"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmDialogComponent {
  @Input() isOpen = false
  @Input() title = "Confirm Action"
  @Input() message = "Are you sure you want to proceed?"
  @Input() confirmText = "Confirm"
  @Input() cancelText = "Cancel"

  @Output() confirm = new EventEmitter<void>()
  @Output() cancel = new EventEmitter<void>()

  onConfirm(): void {
    this.confirm.emit()
  }

  onCancel(): void {
    this.cancel.emit()
  }
}

