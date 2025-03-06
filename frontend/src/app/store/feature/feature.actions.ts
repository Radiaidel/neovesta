import { createAction, props } from "@ngrx/store"
import type { Feature, FeatureFilters, FeatureUpload } from "../../models/feature.model"
import { PageResponse } from "../../models/common.model"

// Load Features
export const loadFeatures = createAction("[Feature] Load Features", props<{ filters: FeatureFilters }>())

export const loadFeaturesSuccess = createAction(
  "[Feature] Load Features Success",
  props<{ response: PageResponse<Feature> }>(),
)

export const loadFeaturesFailure = createAction("[Feature] Load Features Failure", props<{ error: any }>())

// Load Feature
export const loadFeature = createAction("[Feature] Load Feature", props<{ id: string }>())

export const loadFeatureSuccess = createAction("[Feature] Load Feature Success", props<{ feature: Feature }>())

export const loadFeatureFailure = createAction("[Feature] Load Feature Failure", props<{ error: any }>())

// Create Feature
export const createFeature = createAction("[Feature] Create Feature", props<{ featureUpload: FeatureUpload }>())

export const createFeatureSuccess = createAction("[Feature] Create Feature Success", props<{ feature: Feature }>())

export const createFeatureFailure = createAction("[Feature] Create Feature Failure", props<{ error: any }>())

// Update Feature
export const updateFeature = createAction(
  "[Feature] Update Feature",
  props<{ id: string; featureUpload: FeatureUpload }>(),
)

export const updateFeatureSuccess = createAction("[Feature] Update Feature Success", props<{ feature: Feature }>())

export const updateFeatureFailure = createAction("[Feature] Update Feature Failure", props<{ error: any }>())

// Delete Feature
export const deleteFeature = createAction("[Feature] Delete Feature", props<{ id: string }>())

export const deleteFeatureSuccess = createAction("[Feature] Delete Feature Success", props<{ id: string }>())

export const deleteFeatureFailure = createAction("[Feature] Delete Feature Failure", props<{ error: any }>())

// Reset Selected Feature
export const resetSelectedFeature = createAction("[Feature] Reset Selected Feature")

// Set Filters
export const setFeatureFilters = createAction("[Feature] Set Filters", props<{ filters: Partial<FeatureFilters> }>())

export const resetFeatureFilters = createAction("[Feature] Reset Filters")

export const FeatureActions = {
  loadFeatures,
  loadFeaturesSuccess,
  loadFeaturesFailure,
  loadFeature,
  loadFeatureSuccess,
  loadFeatureFailure,
  createFeature,
  createFeatureSuccess,
  createFeatureFailure,
  updateFeature,
  updateFeatureSuccess,
  updateFeatureFailure,
  deleteFeature,
  deleteFeatureSuccess,
  deleteFeatureFailure,
  resetSelectedFeature,
  setFeatureFilters,
  resetFeatureFilters,
}

