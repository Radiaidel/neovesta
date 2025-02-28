export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  RESIDENCE_MANAGER = "RESIDENCE_MANAGER",
  SUB_RESIDENCE_MANAGER = "SUB_RESIDENCE_MANAGER",
  RESIDENT = "RESIDENT",
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  role: Role
  createdAt: string
  updatedAt: string
  status: boolean
}

export interface AuthResponse {
  token: string
  refreshToken: string
  rememberMeToken: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
  rememberMe: boolean
}

export interface RegisterUserRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber: string
  role: Role
}

export interface ForgotPasswordRequest {
  email: string
}

export interface VerifyResetTokenRequest {
  token: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
  confirmPassword: string
}

export interface UpdatePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ApiError {
  message: string
  status: number
}