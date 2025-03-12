import type { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from "@angular/common/http"
import { inject } from "@angular/core"
import { AuthService } from "../services/auth.service"
import { catchError, switchMap, throwError } from "rxjs"
import { Router } from "@angular/router"

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  if (
    req.url.includes("/login") ||
    req.url.includes("/register") ||
    req.url.includes("/forgot-password") ||
    req.url.includes("/reset-password")
  ) {
    return next(req)
  }

  const token = authService.getToken()

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })

    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return authService.refreshToken().pipe(
            switchMap(() => {
              const newToken = authService.getToken()
              const newAuthReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`,
                },
              })

              return next(newAuthReq)
            }),
            catchError((refreshError) => {
              
              authService.logout()
              router.navigate(["/login"])
              return throwError(() => refreshError)
            }),
          )
        }

        return throwError(() => error)
      }),
    )
  }

  return next(req)
}

