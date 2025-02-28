import { createAction, props } from "@ngrx/store"
import type {
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UserSearchRequest,
  PageResponse,
} from "../models/user.model"

// Load Users
export const loadUsers = createAction("[User] Load Users", props<{ request: UserSearchRequest }>())

export const loadUsersSuccess = createAction(
  "[User] Load Users Success",
  props<{ users: PageResponse<UserResponse> }>(),
)

export const loadUsersFailure = createAction("[User] Load Users Failure", props<{ error: any }>())

// Load User by ID
export const loadUserById = createAction("[User] Load User By ID", props<{ userId: string }>())

export const loadUserByIdSuccess = createAction("[User] Load User By ID Success", props<{ user: UserResponse }>())

export const loadUserByIdFailure = createAction("[User] Load User By ID Failure", props<{ error: any }>())

// Create User
export const createUser = createAction("[User] Create User", props<{ user: CreateUserRequest }>())

export const createUserSuccess = createAction("[User] Create User Success", props<{ user: UserResponse }>())

export const createUserFailure = createAction("[User] Create User Failure", props<{ error: any }>())

// Update User
export const updateUser = createAction("[User] Update User", props<{ userId: string; user: UpdateUserRequest }>())

export const updateUserSuccess = createAction("[User] Update User Success", props<{ user: UserResponse }>())

export const updateUserFailure = createAction("[User] Update User Failure", props<{ error: any }>())

export const toggleUserStatus = createAction("[User] Toggle User Status", props<{ userId: string }>())

export const toggleUserStatusSuccess = createAction("[User] Toggle User Status Success", props<{ userId: string }>())

export const toggleUserStatusFailure = createAction("[User] Toggle User Status Failure", props<{ error: any }>())

export const deleteUser = createAction("[User] Delete User", props<{ userId: string }>())

export const deleteUserSuccess = createAction("[User] Delete User Success", props<{ userId: string }>())

export const deleteUserFailure = createAction("[User] Delete User Failure", props<{ error: any }>())

