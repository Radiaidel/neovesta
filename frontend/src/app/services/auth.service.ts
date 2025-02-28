import { Injectable, inject } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import {  Observable, BehaviorSubject, tap } from "rxjs"
import  {
  AuthResponse,
  LoginRequest,
  User,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RegisterUserRequest,
  UpdatePasswordRequest,
} from "../models/user.model"
import { Router } from "@angular/router"
import { environment } from "../../environments/environment"
import { Role } from "../models/user.model"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private http = inject(HttpClient)
  private router = inject(Router)
  private apiUrl = `${environment.apiUrl}/api/v1/auth`

  private currentUserSubject = new BehaviorSubject<User | null>(null)
  currentUser$ = this.currentUserSubject.asObservable()

  constructor() {
    this.loadUserFromStorage()
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      this.currentUserSubject.next(JSON.parse(userData))
    }
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, request)
      .pipe(tap((response) => this.handleAuthResponse(response)))
  }

  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem("token", response.token)
    localStorage.setItem("refreshToken", response.refreshToken)

    if (response.rememberMeToken) {
      localStorage.setItem("rememberMeToken", response.rememberMeToken)
    }

    localStorage.setItem("user", JSON.stringify(response.user))
    this.currentUserSubject.next(response.user)
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/forgot-password`, request)
  }

  resetPassword(request: ResetPasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reset-password`, request)
  }

  updatePassword(userId: string, request: UpdatePasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/users/${userId}/update-password`, request)
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem("refreshToken")
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/refresh-token?refreshToken=${refreshToken}`, {})
      .pipe(tap((response) => this.handleAuthResponse(response)))
  }

  registerUser(request: RegisterUserRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, request)
  }

  logout(): void {
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("rememberMeToken")
    localStorage.removeItem("user")
    this.currentUserSubject.next(null)
    this.router.navigate(["/login"])
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value
  }

  getToken(): string | null {
    return localStorage.getItem("token")
  }
  getCurrentUser(): User | null {
    return this.currentUserSubject.value
  }
  
  hasRole(roles: Role[]): boolean {
    const user = this.getCurrentUser()
    return user ? roles.includes(user.role) : false
  }

  canCreateRole(role: Role): boolean {
    const currentUserRole = this.getCurrentUser()?.role

    if (!currentUserRole) return false

    switch (role) {
      case Role.ADMIN:
        return currentUserRole === Role.SUPER_ADMIN
      case Role.RESIDENCE_MANAGER:
        return currentUserRole === Role.SUPER_ADMIN || currentUserRole === Role.ADMIN
      case Role.SUB_RESIDENCE_MANAGER:
        return currentUserRole === Role.RESIDENCE_MANAGER
      case Role.RESIDENT:
        return currentUserRole === Role.RESIDENCE_MANAGER || currentUserRole === Role.SUB_RESIDENCE_MANAGER
      default:
        return false
    }
  }
}

