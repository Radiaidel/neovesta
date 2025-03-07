import { createFeatureSelector, createSelector } from "@ngrx/store"
import type { FeatureState } from "./feature.reducer"

export const selectFeatureState = createFeatureSelector<FeatureState>("feature")

export const selectAllFeatures = createSelector(selectFeatureState, (state) => state.features)

export const selectSelectedFeature = createSelector(selectFeatureState, (state) => state.selectedFeature)

export const selectFeatureLoading = createSelector(selectFeatureState, (state) => state.loading)

export const selectFeatureError = createSelector(selectFeatureState, (state) => state.error)

export const selectFeatureFilters = createSelector(selectFeatureState, (state) => state.filters)

export const selectFeatureTotalElements = createSelector(selectAllFeatures, (features) => features?.totalElements || 0)

export const selectFeatureTotalPages = createSelector(selectAllFeatures, (features) => features?.totalPages || 0)

export const selectFeatureCurrentPage = createSelector(selectAllFeatures, (features) => features?.number || 0)

export const selectFeaturePageSize = createSelector(selectAllFeatures, (features) => features?.size || 12)

export const selectFeatureIsFirstPage = createSelector(selectAllFeatures, (features) =>
  features?.first !== undefined ? features.first : features?.number === 0,
)

export const selectFeatureIsLastPage = createSelector(selectAllFeatures, (features) =>
  features?.last !== undefined ? features.last : (features?.number || 0) >= (features?.totalPages || 1) - 1,
)

