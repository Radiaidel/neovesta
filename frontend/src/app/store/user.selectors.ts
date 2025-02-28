import { createFeatureSelector, createSelector } from "@ngrx/store"
import type { UserState } from "./user.reducer"

export const selectUserState = createFeatureSelector<UserState>("users")

export const selectUsers = createSelector(selectUserState, (state) => state.users)

export const selectSelectedUser = createSelector(selectUserState, (state) => state.selectedUser)

export const selectLoading = createSelector(selectUserState, (state) => state.loading)

export const selectError = createSelector(selectUserState, (state) => state.error)

