import { createReducer, on } from "@ngrx/store"
import type { ProfileUser, ProfileResidence } from "../../models/profile.model"
import { ProfileActions } from "./profile.actions"

export interface ProfileState {
    user: ProfileUser | null
    residence: ProfileResidence | null
    loading: boolean
    error: any
    passwordUpdateSuccess: boolean
    profileImageUrl: string | null
}

export const initialProfileState: ProfileState = {
    user: null,
    residence: null,
    loading: false,
    error: null,
    passwordUpdateSuccess: false,
    profileImageUrl: null,
}

export const profileReducer = createReducer(
    initialProfileState,

    // Load Profile
    on(ProfileActions.loadProfile, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(ProfileActions.loadProfileSuccess, (state, { user }) => ({
        ...state,
        user,
        loading: false,
    })),
    on(ProfileActions.loadProfileFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false,
    })),

    // Update Profile
    on(ProfileActions.updateProfile, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(ProfileActions.updateProfileSuccess, (state, { user }) => ({
        ...state,
        user,
        loading: false,
    })),
    on(ProfileActions.updateProfileFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false,
    })),

    // Update Password
    on(ProfileActions.updatePassword, (state) => ({
        ...state,
        loading: true,
        error: null,
        passwordUpdateSuccess: false,
      })),
      on(ProfileActions.updatePasswordSuccess, (state, { user }) => ({
        ...state,
        loading: false,
        user: user,
        error: null,
        passwordUpdateSuccess: true,
      })),
      on(ProfileActions.updatePasswordFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
        passwordUpdateSuccess: false,
      })),

    // Upload Profile Image
    on(ProfileActions.uploadProfileImage, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(ProfileActions.uploadProfileImageSuccess, (state, { profilePictureUrl }) => ({
        ...state,
        loading: false,
        profileImageUrl: profilePictureUrl,
        user: state.user ? { ...state.user, profilePictureUrl } : null,
    })),
    on(ProfileActions.uploadProfileImageFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false,
    })),

// Update Residence
on(ProfileActions.updateResidence, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProfileActions.updateResidenceSuccess, (state, { residence }) => ({
    ...state,
    residence,
    loading: false,
  })),
  on(ProfileActions.updateResidenceFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
      on(ProfileActions.loadResidenceProfile, (state) => ({
        ...state,
        loading: true,
        error: null,
      })),
      on(ProfileActions.loadResidenceProfileSuccess, (state, { residence }) => ({
        ...state,
        residence,
        loading: false,
      })),
      on(ProfileActions.loadResidenceProfileFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false,
      })),

    // Reset State
    on(ProfileActions.resetProfileState, () => initialProfileState),
)

