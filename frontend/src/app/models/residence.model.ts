import { User, UserResponse } from "./user.model"

export interface Address {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  latitude: number | null
  longitude: number | null
}

export interface Document {
  name: string
  url: string
  type: string
  uploadedAt: string
}

export interface DocumentUpload {
  name: string
  file: File
  type: string
}

export enum ResidenceStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  UNDER_MAINTENANCE = "UNDER_MAINTENANCE",
  COMING_SOON = "COMING_SOON",
}

export interface Residence {
  id: string
  name: string
  description: string
  imageUrls: string[]
  address: Address
  totalApartments: number
  availableApartments: number
  startingPrice: number
  amenities: string[]
  documents: Document[]
  contactInformation: string
  createdAt: string
  updatedAt: string
  status: ResidenceStatus
  managerId?: string
  manager?: UserResponse
}

export interface CreateResidenceRequest {
  name: string
  description: string
  address: Address
  totalApartments: number
  availableApartments: number
  startingPrice: number
  amenities: string[]
  managerId?: string
  contactInformation: string
  status: ResidenceStatus
}

export interface UpdateResidenceRequest {
  name?: string
  description?: string
  address?: Address
  totalApartments?: number
  availableApartments?: number
  startingPrice?: number
  amenities?: string[]
  contactInformation?: string
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

export interface ResidenceFilters {
  search?: string
  amenities?: string[]
  minPrice?: number
  maxPrice?: number
  city?: string
  page: number
  size: number
  sortBy: string
  sortDir: "asc" | "desc"
}

