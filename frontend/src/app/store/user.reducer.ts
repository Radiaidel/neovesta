import { createReducer, on } from "@ngrx/store"
import  { UserResponse, PageResponse } from "../models/user.model"
import * as UserActions from "./user.actions"

export interface UserState {
  users: PageResponse<UserResponse> | null
  selectedUser: UserResponse | null
  createdUser: UserResponse | null; 
  loading: boolean
  error: any
}

export const initialState: UserState = {
  users: null,
  selectedUser: null,
  createdUser: null, 
  loading: false,
  error: null,
}

export const userReducer = createReducer(
  initialState,

  on(UserActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false,
  })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(UserActions.loadUserById, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.loadUserByIdSuccess, (state, { user }) => ({
    ...state,
    selectedUser: user,
    loading: false,
  })),
  on(UserActions.loadUserByIdFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(UserActions.createUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.createUserSuccess, (state, { user }) => {
    if (!state.users) {
      return {
        ...state,
        loading: false,
      }
    }

    const updatedContent = [...state.users.content]
    if (updatedContent.length < state.users.size) {
      updatedContent.push(user)
    }

    return {
      ...state,
      createdUser: user,
      users: {
        ...state.users,
        content: updatedContent,
        totalElements: state.users.totalElements + 1,
      },
      loading: false,
    }
  }),
  on(UserActions.createUserFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(UserActions.updateUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.updateUserSuccess, (state, { user }) => {
    const updatedSelectedUser = state.selectedUser?.id === user.id ? user : state.selectedUser

    let updatedUsers = state.users
    if (state.users) {
      const updatedContent = state.users.content.map((u) => (u.id === user.id ? user : u))

      updatedUsers = {
        ...state.users,
        content: updatedContent,
      }
    }

    return {
      ...state,
      selectedUser: updatedSelectedUser,
      users: updatedUsers,
      loading: false,
    }
  }),
  on(UserActions.updateUserFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(UserActions.toggleUserStatus, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.toggleUserStatusSuccess, (state, { userId }) => {
    let updatedSelectedUser = state.selectedUser
    if (state.selectedUser?.id === userId) {
      updatedSelectedUser = {
        ...state.selectedUser,
        status: !state.selectedUser.status,
      }
    }

    let updatedUsers = state.users
    if (state.users) {
      const updatedContent = state.users.content.map((user) =>
        user.id === userId ? { ...user, status: !user.status } : user,
      )

      updatedUsers = {
        ...state.users,
        content: updatedContent,
      }
    }

    return {
      ...state,
      selectedUser: updatedSelectedUser,
      users: updatedUsers,
      loading: false,
    }
  }),
  on(UserActions.toggleUserStatusFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(UserActions.deleteUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.deleteUserSuccess, (state, { userId }) => {
    const updatedSelectedUser = state.selectedUser?.id === userId ? null : state.selectedUser

    let updatedUsers = state.users
    if (state.users) {
      const updatedContent = state.users.content.filter((user) => user.id !== userId)

      updatedUsers = {
        ...state.users,
        content: updatedContent,
        totalElements: state.users.totalElements - 1,
      }
    }

    return {
      ...state,
      selectedUser: updatedSelectedUser,
      users: updatedUsers,
      loading: false,
    }
  }),
  on(UserActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(UserActions.createUserSuccess, (state, { user }) => ({
    ...state,
    createdUser: user,
    loading: false,
  })),

  on(UserActions.resetCreatedUser, (state) => ({
    ...state,
    createdUser: null,
  })),

)

