import { createActionGroup, emptyProps, props, createAction } from "@ngrx/store"
import type {
  ProfileUser,
  ProfileUpdateRequest,
  ProfilePasswordUpdateRequest,
  ProfileResidence,
} from "../../models/profile.model"
import { UpdateResidenceRequest } from "../../models/residence.model";

export const ProfileActions = createActionGroup({
  source: "Profile",
  events: {
    // Load user profile
    "Load Profile": props<{ id: string }>(),
    "Load Profile Success": props<{ user: ProfileUser }>(),
    "Load Profile Failure": props<{ error: any }>(),


    "Update Profile": props<{ id: string; request: ProfileUpdateRequest | FormData }>(),
    "Update Profile Success": props<{ user: ProfileUser }>(),
    "Update Profile Failure": props<{ error: any }>(),

    // Update password
    "Update Password": props<{ id: string; request: ProfilePasswordUpdateRequest }>(),
    "Update Password Success": emptyProps(),
    "Update Password Failure": props<{ error: any }>(),

    // Upload profile image
    "Upload Profile Image": props<{ id: string; image: File }>(),
    "Upload Profile Image Success": props<{ profilePictureUrl: string }>(),
    "Upload Profile Image Failure": props<{ error: any }>(),

    // Ajoutez ces actions manquantes
    "Load Residence Profile": props<{ managerId: string }>(),
    "Load Residence Profile Success": props<{ residence: ProfileResidence }>(),
    "Load Residence Profile Failure": props<{ error: any }>(),

// Update residence
"Update Residence": props<{ residenceId: string; request: UpdateResidenceRequest; images?: File[] }>(),
    "Update Residence Success": props<{ residence: ProfileResidence }>(),
    "Update Residence Failure": props<{ error: any }>(),

    // Reset state
    "Reset Profile State": emptyProps(),
  },
})