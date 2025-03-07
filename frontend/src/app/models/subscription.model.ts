import type { Feature } from "./feature.model";
import type { User } from "./user.model";
import { PageResponse } from "./common.model";

export enum SubscriptionType {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
  
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  CANCELLED = "CANCELLED",
}

export interface Subscription {
  id: string;
  user: User;
  feature: Feature;
  type: SubscriptionType;
  startDate: string;
  endDate: string;
  price: number;
  isActive: boolean;
  isConfirmedByAdmin: boolean;
  adminNote?: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionRequest {
  userId?: string;
  featureId: string;
  type: SubscriptionType;
  startDate: string;
  endDate: string;
  price: number;
}

export interface SubscriptionConfirmRequest {
  adminNote?: string;
}

export interface SubscriptionRefuseRequest {
  adminNote: string;
}

export interface SubscriptionPaymentUpdateRequest {
  status: PaymentStatus;
}

export interface SubscriptionFilters {
  userId?: string;
  featureId?: string;
  residenceId?: string;
  type?: SubscriptionType;
  isActive?: boolean;
  isConfirmedByAdmin?: boolean;
  paymentStatus?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  page: number;
  size: number;
  sortBy: string;
  sortDir: "asc" | "desc";
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
}

export type SubscriptionResponse = PageResponse<Subscription>;
