import { Injectable } from "@angular/core"
import { Subject } from "rxjs"

export type ToastType = "success" | "error" | "info" | "warning"

export interface Toast {
  message: string
  type: ToastType
  id: number
}

@Injectable({
  providedIn: "root",
})
export class ToastService {
  private toasts$ = new Subject<Toast>()
  private counter = 0

  get toasts() {
    return this.toasts$.asObservable()
  }

  show(message: string, type: ToastType = "info") {
    this.toasts$.next({
      message,
      type,
      id: this.counter++,
    })
  }
}

