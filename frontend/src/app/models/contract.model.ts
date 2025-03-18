import { Residence } from "./residence.model"
import { UserResponse } from "./user.model"

export enum ContractType {
  LEASE = "LEASE",
  RENT = "RENT",
  PURCHASE = "PURCHASE",
  TEMPORARY = "TEMPORARY",
}

export enum PaymentFrequency {
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  SEMI_ANNUALLY = "SEMI_ANNUALLY",
  ANNUALLY = "ANNUALLY",
  ONE_TIME = "ONE_TIME",
}

export enum PaymentMethod {
  BANK_TRANSFER = "BANK_TRANSFER",
  CREDIT_CARD = "CREDIT_CARD",
  CASH = "CASH",
  CHECK = "CHECK",
  DIRECT_DEBIT = "DIRECT_DEBIT",
}

export interface ContractRequest {
  residentId: string
  residenceId: string
  startDate: string
  endDate: string
  contractType: ContractType
  totalAmount: number
  paidAmount: number
  paymentFrequency: PaymentFrequency
  paymentMethod: PaymentMethod
  contractRules?: string
}

export interface Contract extends ContractRequest {
  id: string
  resident: UserResponse
  residence: Residence
  createdAt: string
  updatedAt: string
  status: ContractStatus
}

export enum ContractStatus {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  TERMINATED = "TERMINATED",
  PENDING = "PENDING",
}

export interface ContractFilters {
  residentId?: string
  residenceId?: string
  resident?: UserResponse
  residence?: Residence
  contractType?: ContractType
  status?: ContractStatus
  startDateFrom?: string
  startDateTo?: string
  endDateFrom?: string
  endDateTo?: string
  page: number
  size: number
  sortBy: string
  sortDir: "asc" | "desc"
}


