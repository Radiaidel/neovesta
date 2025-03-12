import { createFeatureSelector, createSelector } from "@ngrx/store"
import type { ProfileState } from "./profile.reducer"

export const selectProfileState = createFeatureSelector<ProfileState>("profile")

export const selectProfileUser = createSelector(selectProfileState, (state) => state.user)

export const selectProfileResidence = createSelector(selectProfileState, (state) => state.residence)

export const selectProfileLoading = createSelector(selectProfileState, (state) => state.loading)

export const selectProfileError = createSelector(selectProfileState, (state) => state.error)

export const selectPasswordUpdateSuccess = createSelector(selectProfileState, (state) => state.passwordUpdateSuccess)

export const selectProfileImageUrl = createSelector(selectProfileState, (state) => state.profileImageUrl)

export const selectIsResidenceManager = createSelector(
  selectProfileUser,
  (user) => user?.role === "RESIDENCE_MANAGER" || user?.role === "SUB_RESIDENCE_MANAGER",
)

