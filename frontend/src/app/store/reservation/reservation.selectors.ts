import { createFeatureSelector, createSelector } from "@ngrx/store"
import type { ReservationState } from "./reservation.reducer"

export const selectReservationState = createFeatureSelector<ReservationState>("reservations")

export const selectAllReservations = createSelector(selectReservationState, (state) => state.reservations)

export const selectSelectedReservation = createSelector(selectReservationState, (state) => state.selectedReservation)

export const selectStatusReservations = createSelector(selectReservationState, (state) => state.statusReservations)

export const selectReservationLoading = createSelector(selectReservationState, (state) => state.loading)

export const selectReservationError = createSelector(selectReservationState, (state) => state.error)

export const selectReservationFilters = createSelector(selectReservationState, (state) => state.filters)

export const selectReservationTotalElements = createSelector(
  selectAllReservations,
  (reservations) => reservations?.totalElements || 0,
)

export const selectReservationTotalPages = createSelector(
  selectAllReservations,
  (reservations) => reservations?.totalPages || 0,
)

export const selectReservationCurrentPage = createSelector(
  selectAllReservations,
  (reservations) => reservations?.number || 0,
)

export const selectReservationPageSize = createSelector(
  selectAllReservations,
  (reservations) => reservations?.size || 10,
)

export const selectReservationIsFirstPage = createSelector(selectAllReservations, (reservations) =>
  reservations?.first !== undefined ? reservations.first : reservations?.number === 0,
)

export const selectReservationIsLastPage = createSelector(selectAllReservations, (reservations) =>
  reservations?.last !== undefined
    ? reservations.last
    : (reservations?.number || 0) >= (reservations?.totalPages || 1) - 1,
)

