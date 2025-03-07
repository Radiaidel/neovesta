import { createReducer, on } from "@ngrx/store"
import type { PageResponse, Reservation, ReservationFilters } from "../../models/reservation.model"
import * as ReservationActions from "./reservation.actions"

export interface ReservationState {
  reservations: PageResponse<Reservation> | null
  selectedReservation: Reservation | null
  statusReservations: Reservation[] | null
  loading: boolean
  error: any
  filters: ReservationFilters
}

export const initialFilters: ReservationFilters = {
  page: 0,
  size: 10,
  sortBy: "requestedDate",
  sortDir: "desc",
}

export const initialState: ReservationState = {
  reservations: null,
  selectedReservation: null,
  statusReservations: null,
  loading: false,
  error: null,
  filters: initialFilters,
}

export const reservationReducer = createReducer(
  initialState,

  // Load reservations
  on(ReservationActions.loadReservations, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ReservationActions.loadReservationsSuccess, (state, { response }) => ({
    ...state,
    reservations: response,
    loading: false,
  })),
  on(ReservationActions.loadReservationsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load single reservation
  on(ReservationActions.loadReservation, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ReservationActions.loadReservationSuccess, (state, { reservation }) => ({
    ...state,
    selectedReservation: reservation,
    loading: false,
  })),
  on(ReservationActions.loadReservationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create reservation
  on(ReservationActions.createReservation, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ReservationActions.createReservationSuccess, (state, { reservation }) => ({
    ...state,
    loading: false,
  })),
  on(ReservationActions.createReservationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update reservation
  on(ReservationActions.updateReservation, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ReservationActions.updateReservationSuccess, (state, { reservation }) => ({
    ...state,
    selectedReservation: reservation,
    loading: false,
  })),
  on(ReservationActions.updateReservationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete reservation
  on(ReservationActions.deleteReservation, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ReservationActions.deleteReservationSuccess, (state, { id }) => {
    // If we have reservations loaded, filter out the deleted one
    const updatedReservations = state.reservations
      ? {
          ...state.reservations,
          content: state.reservations.content.filter((r) => r.id !== id),
          totalElements: state.reservations.totalElements - 1,
        }
      : null

    return {
      ...state,
      reservations: updatedReservations,
      loading: false,
    }
  }),
  on(ReservationActions.deleteReservationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Confirm reservation
  on(ReservationActions.confirmReservation, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ReservationActions.confirmReservationSuccess, (state, { reservation }) => {
    // Update the reservation in the list if it exists
    const updatedReservations = state.reservations
      ? {
          ...state.reservations,
          content: state.reservations.content.map((r) => (r.id === reservation.id ? reservation : r)),
        }
      : null

    return {
      ...state,
      reservations: updatedReservations,
      selectedReservation: reservation,
      loading: false,
    }
  }),
  on(ReservationActions.confirmReservationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Reject reservation
  on(ReservationActions.rejectReservation, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ReservationActions.rejectReservationSuccess, (state, { reservation }) => {
    // Update the reservation in the list if it exists
    const updatedReservations = state.reservations
      ? {
          ...state.reservations,
          content: state.reservations.content.map((r) => (r.id === reservation.id ? reservation : r)),
        }
      : null

    return {
      ...state,
      reservations: updatedReservations,
      selectedReservation: reservation,
      loading: false,
    }
  }),
  on(ReservationActions.rejectReservationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Cancel reservation
  on(ReservationActions.cancelReservation, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ReservationActions.cancelReservationSuccess, (state, { reservation }) => {
    // Update the reservation in the list if it exists
    const updatedReservations = state.reservations
      ? {
          ...state.reservations,
          content: state.reservations.content.map((r) => (r.id === reservation.id ? reservation : r)),
        }
      : null

    return {
      ...state,
      reservations: updatedReservations,
      selectedReservation: reservation,
      loading: false,
    }
  }),
  on(ReservationActions.cancelReservationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load reservations by status
  on(ReservationActions.loadReservationsByStatus, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ReservationActions.loadReservationsByStatusSuccess, (state, { reservations }) => ({
    ...state,
    statusReservations: reservations,
    loading: false,
  })),
  on(ReservationActions.loadReservationsByStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Reset selected reservation
  on(ReservationActions.resetSelectedReservation, (state) => ({
    ...state,
    selectedReservation: null,
  })),

  // Set filters
  on(ReservationActions.setReservationFilters, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters },
  })),
  on(ReservationActions.resetReservationFilters, (state) => ({
    ...state,
    filters: initialFilters,
  })),
)

