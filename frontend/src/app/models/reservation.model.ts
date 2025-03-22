import type { Feature } from "./feature.model"
import { User } from "./user.model"

export enum ReservationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export interface ReservationRequest {
  residentId: string
  featureId: string
  requestedDate: string 
}

export interface Reservation {
  id: string
  requestedDate: string 
  scheduledDate?: string 
  price: number
  status: ReservationStatus
  adminNote?: string
  resident?: User
  feature?: Feature
  createdAt?: string
  updatedAt?: string
}

export interface ReservationFilters {
  residentId?: string
  featureId?: string
  status?: ReservationStatus
  dateFilter?: string
  search?: string
  page: number
  size: number
  sortBy: string
  sortDir: "asc" | "desc"
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

