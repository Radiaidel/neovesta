import { createReducer, on } from "@ngrx/store"
import type { Feature, FeatureFilters } from "../../models/feature.model"
import { PageResponse } from "../../models/common.model"
import * as FeatureActions from "./feature.actions"

export interface FeatureState {
  features: PageResponse<Feature> | null
  selectedFeature: Feature | null
  loading: boolean
  error: any
  filters: FeatureFilters
}

export const initialFilters: FeatureFilters = {
  page: 0,
  size: 12,
  sortBy: "created_at",
  sortDir: "desc",
}

export const initialState: FeatureState = {
  features: null,
  selectedFeature: null,
  loading: false,
  error: null,
  filters: initialFilters,
}

export const featureReducer = createReducer(
  initialState,

  on(FeatureActions.loadFeatures, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(FeatureActions.loadFeaturesSuccess, (state, { response }) => ({
    ...state,
    features: response,
    loading: false,
  })),
  on(FeatureActions.loadFeaturesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(FeatureActions.loadFeature, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(FeatureActions.loadFeatureSuccess, (state, { feature }) => ({
    ...state,
    selectedFeature: feature,
    loading: false,
  })),
  on(FeatureActions.loadFeatureFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(FeatureActions.createFeature, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(FeatureActions.createFeatureSuccess, (state, { feature }) => ({
    ...state,
    loading: false,
  })),
  on(FeatureActions.createFeatureFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(FeatureActions.updateFeature, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(FeatureActions.updateFeatureSuccess, (state, { feature }) => ({
    ...state,
    selectedFeature: feature,
    loading: false,
  })),
  on(FeatureActions.updateFeatureFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(FeatureActions.deleteFeature, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(FeatureActions.deleteFeatureSuccess, (state, { id }) => {
    const updatedFeatures = state.features
      ? {
          ...state.features,
          content: state.features.content.filter((f) => f.id !== id),
          totalElements: state.features.totalElements - 1,
        }
      : null

    return {
      ...state,
      features: updatedFeatures,
      loading: false,
    }
  }),
  on(FeatureActions.deleteFeatureFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(FeatureActions.resetSelectedFeature, (state) => ({
    ...state,
    selectedFeature: null,
  })),

  on(FeatureActions.setFeatureFilters, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters },
  })),
  on(FeatureActions.resetFeatureFilters, (state) => ({
    ...state,
    filters: initialFilters,
  })),
)

