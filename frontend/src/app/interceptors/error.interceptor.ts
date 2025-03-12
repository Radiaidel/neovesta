import type { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http"
import { inject } from "@angular/core"
import { Router } from "@angular/router"
import { catchError, throwError } from "rxjs"
import { AuthService } from "../services/auth.service"

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Special handling for password update errors
      if (error.status === 401 && req.url.includes("/password")) {
        // Don't auto logout for password update errors
        return throwError(() => error)
      }

      if (error.status === 401) {
        // Auto logout if 401 response returned from API (except for password updates)
        authService.logout()
        router.navigate(["/login"])
      }

      const errorMessage = error.error?.message || error.statusText || "Unknown error"
      return throwError(() => new Error(errorMessage))
    }),
  )
}

