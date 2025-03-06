import { inject } from "@angular/core"
import { type CanActivateFn, Router } from "@angular/router"
import { AuthService } from "../services/auth.service"
import type {  Role} from "../models/user.model"

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  const roles = route.data["roles"] as Role[]

  if (authService.hasRole(roles)) {
    return true
  }

  router.navigate(["/dashboard"])
  return false
}

