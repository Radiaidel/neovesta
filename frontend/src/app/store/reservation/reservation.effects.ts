import { Injectable, inject } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { catchError, map, mergeMap, of, tap } from "rxjs"
import { ReservationService } from "../../services/reservation.service"
import * as ReservationActions from "./reservation.actions"
import { Router } from "@angular/router"
import { ToastService } from "../../services/toast.service"

@Injectable()
export class ReservationEffects {
  private actions$ = inject(Actions)
  private reservationService = inject(ReservationService)
  private router = inject(Router)
  private toastService = inject(ToastService)

  loadReservations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservationActions.loadReservations),
      mergeMap(({ filters }) =>
        this.reservationService.getAllReservations(filters).pipe(
          map((response) => ReservationActions.loadReservationsSuccess({ response })),
          catchError((error) => of(ReservationActions.loadReservationsFailure({ error }))),
        ),
      ),
    ),
  )

  loadReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservationActions.loadReservation),
      mergeMap(({ id }) =>
        this.reservationService.getReservationById(id).pipe(
          map((reservation) => ReservationActions.loadReservationSuccess({ reservation })),
          catchError((error) => of(ReservationActions.loadReservationFailure({ error }))),
        ),
      ),
    ),
  )

  createReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservationActions.createReservation),
      mergeMap(({ reservation }) =>
        this.reservationService.createReservation(reservation).pipe(
          map((newReservation) => ReservationActions.createReservationSuccess({ reservation: newReservation })),
          catchError((error) => of(ReservationActions.createReservationFailure({ error }))),
        ),
      ),
    ),
  )

  createReservationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ReservationActions.createReservationSuccess),
        tap(({ reservation }) => {
          this.toastService.show("Reservation created successfully", "success")
          this.router.navigate(["/reservations", reservation.id])
        }),
      ),
    { dispatch: false },
  )

  updateReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservationActions.updateReservation),
      mergeMap(({ id, reservation }) =>
        this.reservationService.updateReservation(id, reservation).pipe(
          map((updatedReservation) => ReservationActions.updateReservationSuccess({ reservation: updatedReservation })),
          catchError((error) => of(ReservationActions.updateReservationFailure({ error }))),
        ),
      ),
    ),
  )

  updateReservationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ReservationActions.updateReservationSuccess),
        tap(({ reservation }) => {
          this.toastService.show("Reservation updated successfully", "success")
          this.router.navigate(["/reservations", reservation.id])
        }),
      ),
    { dispatch: false },
  )

  deleteReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservationActions.deleteReservation),
      mergeMap(({ id }) =>
        this.reservationService.deleteReservation(id).pipe(
          map(() => ReservationActions.deleteReservationSuccess({ id })),
          catchError((error) => of(ReservationActions.deleteReservationFailure({ error }))),
        ),
      ),
    ),
  )

  deleteReservationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ReservationActions.deleteReservationSuccess),
        tap(() => {
          this.toastService.show("Reservation deleted successfully", "success")
          this.router.navigate(["/reservations"])
        }),
      ),
    { dispatch: false },
  )

  confirmReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservationActions.confirmReservation),
      mergeMap(({ id, scheduledDate }) =>
        this.reservationService.confirmReservation(id, scheduledDate).pipe(
          map((reservation) => ReservationActions.confirmReservationSuccess({ reservation })),
          catchError((error) => of(ReservationActions.confirmReservationFailure({ error }))),
        ),
      ),
    ),
  )

  confirmReservationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ReservationActions.confirmReservationSuccess),
        tap(() => {
          this.toastService.show("Reservation confirmed successfully", "success")
        }),
      ),
    { dispatch: false },
  )

  rejectReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservationActions.rejectReservation),
      mergeMap(({ id, adminNote }) =>
        this.reservationService.rejectReservation(id, adminNote).pipe(
          map((reservation) => ReservationActions.rejectReservationSuccess({ reservation })),
          catchError((error) => of(ReservationActions.rejectReservationFailure({ error }))),
        ),
      ),
    ),
  )

  rejectReservationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ReservationActions.rejectReservationSuccess),
        tap(() => {
          this.toastService.show("Reservation rejected", "info")
        }),
      ),
    { dispatch: false },
  )

  cancelReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservationActions.cancelReservation),
      mergeMap(({ id }) =>
        this.reservationService.cancelReservation(id).pipe(
          map((reservation) => ReservationActions.cancelReservationSuccess({ reservation })),
          catchError((error) => of(ReservationActions.cancelReservationFailure({ error }))),
        ),
      ),
    ),
  )

  cancelReservationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ReservationActions.cancelReservationSuccess),
        tap(() => {
          this.toastService.show("Reservation cancelled", "info")
        }),
      ),
    { dispatch: false },
  )

  loadReservationsByStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservationActions.loadReservationsByStatus),
      mergeMap(({ status }) =>
        this.reservationService.getReservationsByStatus(status).pipe(
          map((reservations) => ReservationActions.loadReservationsByStatusSuccess({ reservations })),
          catchError((error) => of(ReservationActions.loadReservationsByStatusFailure({ error }))),
        ),
      ),
    ),
  )

  handleError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ReservationActions.loadReservationsFailure,
          ReservationActions.loadReservationFailure,
          ReservationActions.createReservationFailure,
          ReservationActions.updateReservationFailure,
          ReservationActions.deleteReservationFailure,
          ReservationActions.confirmReservationFailure,
          ReservationActions.rejectReservationFailure,
          ReservationActions.cancelReservationFailure,
          ReservationActions.loadReservationsByStatusFailure,
        ),
        tap(({ error }) => {
          const message = error?.error?.message || "An error occurred"
          this.toastService.show(message, "error")
        }),
      ),
    { dispatch: false },
  )
}

