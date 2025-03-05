import { createFeatureSelector, createSelector } from "@ngrx/store"
import type { ResidenceState } from "./residence.reducer"

export const selectResidenceState = createFeatureSelector<ResidenceState>("residences")

export const selectAllResidences = createSelector(selectResidenceState, (state) => state.residences)

export const selectSelectedResidence = createSelector(selectResidenceState, (state) => state.selectedResidence)

export const selectCities = createSelector(selectResidenceState, (state) => state.cities)

export const selectLoading = createSelector(selectResidenceState, (state) => state.loading)

export const selectError = createSelector(selectResidenceState, (state) => state.error)

export const selectFilters = createSelector(selectResidenceState, (state) => state.filters)

export const selectTotalElements = createSelector(selectAllResidences, (residences) => residences?.totalElements || 0)

export const selectTotalPages = createSelector(selectAllResidences, (residences) => residences?.totalPages || 0)

export const selectCurrentPage = createSelector(selectAllResidences, (residences) => residences?.number || 0)

export const selectPageSize = createSelector(selectAllResidences, (residences) => residences?.size || 10)

export const selectIsFirstPage = createSelector(selectAllResidences, (residences) => residences?.first || true)

export const selectIsLastPage = createSelector(selectAllResidences, (residences) => residences?.last || true)

