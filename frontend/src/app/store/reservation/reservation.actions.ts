import { createAction, props } from "@ngrx/store"
import type {
  PageResponse,
  Reservation,
  ReservationFilters,
  ReservationRequest,
  ReservationStatus,
} from "../../models/reservation.model"

export const loadReservations = createAction(
  "[Reservation] Load Reservations",
  props<{ filters: ReservationFilters }>(),
)

export const loadReservationsSuccess = createAction(
  "[Reservation] Load Reservations Success",
  props<{ response: PageResponse<Reservation> }>(),
)

export const loadReservationsFailure = createAction("[Reservation] Load Reservations Failure", props<{ error: any }>())

export const loadReservation = createAction("[Reservation] Load Reservation", props<{ id: string }>())

export const loadReservationSuccess = createAction(
  "[Reservation] Load Reservation Success",
  props<{ reservation: Reservation }>(),
)

export const loadReservationFailure = createAction("[Reservation] Load Reservation Failure", props<{ error: any }>())

export const createReservation = createAction(
  "[Reservation] Create Reservation",
  props<{ reservation: ReservationRequest }>(),
)

export const createReservationSuccess = createAction(
  "[Reservation] Create Reservation Success",
  props<{ reservation: Reservation }>(),
)

export const createReservationFailure = createAction(
  "[Reservation] Create Reservation Failure",
  props<{ error: any }>(),
)

export const updateReservation = createAction(
  "[Reservation] Update Reservation",
  props<{ id: string; reservation: ReservationRequest }>(),
)

export const updateReservationSuccess = createAction(
  "[Reservation] Update Reservation Success",
  props<{ reservation: Reservation }>(),
)

export const updateReservationFailure = createAction(
  "[Reservation] Update Reservation Failure",
  props<{ error: any }>(),
)

export const deleteReservation = createAction("[Reservation] Delete Reservation", props<{ id: string }>())

export const deleteReservationSuccess = createAction(
  "[Reservation] Delete Reservation Success",
  props<{ id: string }>(),
)

export const deleteReservationFailure = createAction(
  "[Reservation] Delete Reservation Failure",
  props<{ error: any }>(),
)

export const confirmReservation = createAction(
  "[Reservation] Confirm Reservation",
  props<{ id: string; scheduledDate: string }>(),
)

export const confirmReservationSuccess = createAction(
  "[Reservation] Confirm Reservation Success",
  props<{ reservation: Reservation }>(),
)

export const confirmReservationFailure = createAction(
  "[Reservation] Confirm Reservation Failure",
  props<{ error: any }>(),
)

export const rejectReservation = createAction(
  "[Reservation] Reject Reservation",
  props<{ id: string; adminNote: string }>(),
)

export const rejectReservationSuccess = createAction(
  "[Reservation] Reject Reservation Success",
  props<{ reservation: Reservation }>(),
)

export const rejectReservationFailure = createAction(
  "[Reservation] Reject Reservation Failure",
  props<{ error: any }>(),
)

export const cancelReservation = createAction("[Reservation] Cancel Reservation", props<{ id: string }>())

export const cancelReservationSuccess = createAction(
  "[Reservation] Cancel Reservation Success",
  props<{ reservation: Reservation }>(),
)

export const cancelReservationFailure = createAction(
  "[Reservation] Cancel Reservation Failure",
  props<{ error: any }>(),
)

export const loadReservationsByStatus = createAction(
  "[Reservation] Load Reservations By Status",
  props<{ status: ReservationStatus }>(),
)

export const loadReservationsByStatusSuccess = createAction(
  "[Reservation] Load Reservations By Status Success",
  props<{ reservations: Reservation[] }>(),
)

export const loadReservationsByStatusFailure = createAction(
  "[Reservation] Load Reservations By Status Failure",
  props<{ error: any }>(),
)

export const resetSelectedReservation = createAction("[Reservation] Reset Selected Reservation")

export const setReservationFilters = createAction(
  "[Reservation] Set Filters",
  props<{ filters: Partial<ReservationFilters> }>(),
)

export const resetReservationFilters = createAction("[Reservation] Reset Filters")

export const ReservationActions = {
  loadReservations,
  loadReservationsSuccess,
  loadReservationsFailure,
  loadReservation,
  loadReservationSuccess,
  loadReservationFailure,
  createReservation,
  createReservationSuccess,
  createReservationFailure,
  updateReservation,
  updateReservationSuccess,
  updateReservationFailure,
  deleteReservation,
  deleteReservationSuccess,
  deleteReservationFailure,
  confirmReservation,
  confirmReservationSuccess,
  confirmReservationFailure,
  rejectReservation,
  rejectReservationSuccess,
  rejectReservationFailure,
  cancelReservation,
  cancelReservationSuccess,
  cancelReservationFailure,
  loadReservationsByStatus,
  loadReservationsByStatusSuccess,
  loadReservationsByStatusFailure,
  resetSelectedReservation,
  setReservationFilters,
  resetReservationFilters,
}

