import { PageRequest } from "./common.model"

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  RESIDENCE_MANAGER = "RESIDENCE_MANAGER",
  SUB_RESIDENCE_MANAGER = "SUB_RESIDENCE_MANAGER",
  RESIDENT = "RESIDENT",
}

export interface User {
  id: string
  profileImage?: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  role: Role
  createdAt: string
  updatedAt: string
  status: boolean
  residenceId?: string
  managerId?: string
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




export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED'
}




export interface UserResponse {
  id: string
  profileImage?: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  role: Role
  status: boolean
  residenceId?: string
  managerId?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateUserRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber: string
  role: Role
  residenceId?: string
  managerId?: string
}

export interface UpdateUserRequest {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}


export interface UserSearchRequest {
  searchTerm?: string
  page?: number
  size?: number
  role?: Role | undefined | null
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
}

