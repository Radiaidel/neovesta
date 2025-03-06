export enum FeatureType {
  SUBSCRIPTION_BASED = "SUBSCRIPTION_BASED",
  RESERVATION_BASED = "RESERVATION_BASED",
}

export enum FeatureCategory {
  LEISURE = "LEISURE",
  WELLNESS = "WELLNESS",
  MAINTENANCE = "MAINTENANCE",
  TRANSPORT = "TRANSPORT",
  CLEANING = "CLEANING",
  CATERING = "CATERING",
  EDUCATION = "EDUCATION",
  SECURITY = "SECURITY",
  ENTERTAINMENT = "ENTERTAINMENT",
  SPORT = "SPORT",
  HEALTH = "HEALTH",
  KIDS = "KIDS",
  BUSINESS = "BUSINESS",
  OTHER = "OTHER",
}

export interface FeatureRequest {
  residenceId: string
  name: string
  description?: string
  featureType: FeatureType
  featureCategory: FeatureCategory
  location?: string
  active: boolean
  termsAndConditions?: string
  cancellationPolicy?: string
  requiresManagerApproval?: boolean
}

export interface Feature extends FeatureRequest {
  id: string
  imageUrl?: string
  residenceName?: string
  createdAt: string
  updatedAt?: string
}

export interface FeatureFilters {
  residenceName?: string
  featureType?: FeatureType
  featureCategory?: FeatureCategory
  active?: boolean
  search?: string
  page: number
  size: number
  sortBy: string
  sortDir: "asc" | "desc"
}

export interface FeatureUpload {
  feature: FeatureRequest
  image?: File
}

