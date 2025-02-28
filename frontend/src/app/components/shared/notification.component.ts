import { Component, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { NotificationService } from "../../services/notification.service"
import { Notification } from "../../services/notification.service"
@Component({
  selector: "app-notifications",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      @for (notification of notifications; track notification.id) {
        <div 
          class="p-4 rounded-lg shadow-lg flex items-start gap-3 animate-in slide-in-from-right-5 duration-300"
          [ngClass]="{
            'bg-green-50 text-green-800 border-l-4 border-green-500': notification.type === 'success',
            'bg-red-50 text-red-800 border-l-4 border-red-500': notification.type === 'error',
            'bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500': notification.type === 'warning',
            'bg-blue-50 text-blue-800 border-l-4 border-blue-500': notification.type === 'info'
          }"
        >
          <div class="flex-1">
            <div class="flex justify-between items-center">
              <p class="font-medium">
                @if (notification.type === 'success') {
                  Success
                } @else if (notification.type === 'error') {
                  Error
                } @else if (notification.type === 'warning') {
                  Warning
                } @else {
                  Information
                }
              </p>
              <button 
                (click)="dismiss(notification.id)" 
                class="text-gray-500 hover:text-gray-700"
                aria-label="Close notification"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            <p class="mt-1">{{ notification.message }}</p>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
    @keyframes slide-in-from-right {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    .animate-in {
      animation: slide-in-from-right 0.3s ease-out;
    }
  `,
  ],
})
export class NotificationsComponent implements OnInit {
  private notificationService = inject(NotificationService)
  notifications: Notification[] = []

  ngOnInit(): void {
    this.notificationService.notifications$.subscribe((notifications) => {
      this.notifications = notifications
    })
  }

  dismiss(id: string): void {
    this.notificationService.dismiss(id)
  }
}

