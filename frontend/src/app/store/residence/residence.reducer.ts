import { createReducer, on } from "@ngrx/store"
import type { PageResponse, Residence, ResidenceFilters } from "../../models/residence.model"
import * as ResidenceActions from "./residence.actions"

export interface ResidenceState {
  residences: PageResponse<Residence> | null
  selectedResidence: Residence | null
  cities: PageResponse<string> | null
  loading: boolean
  error: any
  filters: ResidenceFilters
}

export const initialFilters: ResidenceFilters = {
  page: 0,
  size: 10,
  sortBy: "createdAt",
  sortDir: "desc",
}

export const initialState: ResidenceState = {
  residences: null,
  selectedResidence: null,
  cities: null,
  loading: false,
  error: null,
  filters: initialFilters,
}

export const residenceReducer = createReducer(
  initialState,

  // Load residences
  on(ResidenceActions.loadResidences, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ResidenceActions.loadResidencesSuccess, (state, { response }) => ({
    ...state,
    residences: response,
    loading: false,
  })),
  on(ResidenceActions.loadResidencesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load single residence
  on(ResidenceActions.loadResidence, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ResidenceActions.loadResidenceSuccess, (state, { residence }) => ({
    ...state,
    selectedResidence: residence,
    loading: false,
  })),
  on(ResidenceActions.loadResidenceFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create residence
  on(ResidenceActions.createResidence, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ResidenceActions.createResidenceSuccess, (state, { residence }) => ({
    ...state,
    loading: false,
    // We don't update the list here as we'll reload it after navigation
  })),
  on(ResidenceActions.createResidenceFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update residence
  on(ResidenceActions.updateResidence, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ResidenceActions.updateResidenceSuccess, (state, { residence }) => ({
    ...state,
    selectedResidence: residence,
    loading: false,
    // We don't update the list here as we'll reload it after navigation
  })),
  on(ResidenceActions.updateResidenceFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete residence
  on(ResidenceActions.deleteResidence, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ResidenceActions.deleteResidenceSuccess, (state, { id }) => {
    // If we have residences loaded, filter out the deleted one
    const updatedResidences = state.residences
      ? {
          ...state.residences,
          content: state.residences.content.filter((r) => r.id !== id),
          totalElements: state.residences.totalElements - 1,
        }
      : null

    return {
      ...state,
      residences: updatedResidences,
      loading: false,
    }
  }),
  on(ResidenceActions.deleteResidenceFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load cities
  on(ResidenceActions.loadCities, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ResidenceActions.loadCitiesSuccess, (state, { response }) => ({
    ...state,
    cities: response,
    loading: false,
  })),
  on(ResidenceActions.loadCitiesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Reset selected residence
  on(ResidenceActions.resetSelectedResidence, (state) => ({
    ...state,
    selectedResidence: null,
  })),

  // Set filters
  on(ResidenceActions.setFilters, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters },
  })),
  on(ResidenceActions.resetFilters, (state) => ({
    ...state,
    filters: initialFilters,
  })),
)
