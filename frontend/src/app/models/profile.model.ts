import { Address, Residence } from "./residence.model"
import type { Role } from "./user.model"

export interface ProfileUser {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  role: Role
  profilePictureUrl?: string
  address?: string
  status: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ProfileUpdateRequest {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  profilePicture?: File;
}

export interface ProfilePasswordUpdateRequest {
  currentPassword: string
  newPassword: string
}

export interface ProfileImageUploadResponse {
  profilePictureUrl: string;
}

export interface ProfileResidence extends Residence{

}

export interface ProfileDocument {
  id: string
  name: string
  url: string
  type: string
  createdAt: string
}

