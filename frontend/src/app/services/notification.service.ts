import { Injectable } from "@angular/core"
import { BehaviorSubject, type Observable } from "rxjs"

export enum NotificationType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

export interface Notification {
  id: string
  type: NotificationType
  message: string
  duration?: number
}

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([])
  notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable()

  show(type: NotificationType, message: string, duration = 5000): string {
    const id = this.generateId()
    const notification: Notification = {
      id,
      type,
      message,
      duration,
    }

    const currentNotifications = this.notificationsSubject.getValue()
    this.notificationsSubject.next([...currentNotifications, notification])

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration)
    }

    return id
  }

  success(message: string, duration = 5000): string {
    return this.show(NotificationType.SUCCESS, message, duration)
  }

  error(message: string, duration = 5000): string {
    return this.show(NotificationType.ERROR, message, duration)
  }

  warning(message: string, duration = 5000): string {
    return this.show(NotificationType.WARNING, message, duration)
  }

  info(message: string, duration = 5000): string {
    return this.show(NotificationType.INFO, message, duration)
  }

  dismiss(id: string): void {
    const currentNotifications = this.notificationsSubject.getValue()
    this.notificationsSubject.next(currentNotifications.filter((notification) => notification.id !== id))
  }

  clear(): void {
    this.notificationsSubject.next([])
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 11)
  }
}



