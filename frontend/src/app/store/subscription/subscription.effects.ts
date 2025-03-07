import { Injectable, inject } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { Router } from "@angular/router"
import { of } from "rxjs"
import { catchError, map, switchMap, tap } from "rxjs/operators"
import { SubscriptionService } from "../../services/subscription.service"
import { ToastService } from "../../services/toast.service"
import * as SubscriptionActions from "./subscription.actions"

@Injectable()
export class SubscriptionEffects {
  private actions$ = inject(Actions)
  private subscriptionService = inject(SubscriptionService)
  private toastService = inject(ToastService)
  private router = inject(Router)

  loadSubscriptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubscriptionActions.loadSubscriptions),
      switchMap(({ filters }) =>
        this.subscriptionService.getAllSubscriptions(filters).pipe(
          map((response) => SubscriptionActions.loadSubscriptionsSuccess({ response })),
          catchError((error) => of(SubscriptionActions.loadSubscriptionsFailure({ error }))),
        ),
      ),
    ),
  )

  loadSubscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubscriptionActions.loadSubscription),
      switchMap(({ id }) =>
        this.subscriptionService.getSubscriptionById(id).pipe(
          map((subscription) => SubscriptionActions.loadSubscriptionSuccess({ subscription })),
          catchError((error) => of(SubscriptionActions.loadSubscriptionFailure({ error }))),
        ),
      ),
    ),
  )

  createSubscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubscriptionActions.createSubscription),
      switchMap(({ subscription }) =>
        this.subscriptionService.createSubscription(subscription).pipe(
          map((createdSubscription) => {
            this.toastService.show("Subscription created successfully" , "success")
            return SubscriptionActions.createSubscriptionSuccess({ subscription: createdSubscription })
          }),
          catchError((error) => {
            this.toastService.show("Failed to create subscription" , "success")
            return of(SubscriptionActions.createSubscriptionFailure({ error }))
          }),
        ),
      ),
    ),
  )

  createSubscriptionSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SubscriptionActions.createSubscriptionSuccess),
        tap(({ subscription }) => {
          this.router.navigate(["/subscriptions", subscription.id])
        }),
      ),
    { dispatch: false },
  )

  updateSubscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubscriptionActions.updateSubscription),
      switchMap(({ id, subscription }) =>
        this.subscriptionService.updateSubscription(id, subscription).pipe(
          map((updatedSubscription) => {
            this.toastService.show("Subscription updated successfully", "success")
            return SubscriptionActions.updateSubscriptionSuccess({ subscription: updatedSubscription })
          }),
          catchError((error) => {
            this.toastService.show("Failed to update subscription", "error")
            return of(SubscriptionActions.updateSubscriptionFailure({ error }))
          }),
        ),
      ),
    ),
  )

  updateSubscriptionSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SubscriptionActions.updateSubscriptionSuccess),
        tap(({ subscription }) => {
          this.router.navigate(["/subscriptions", subscription.id])
        }),
      ),
    { dispatch: false },
  )

  deleteSubscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubscriptionActions.deleteSubscription),
      switchMap(({ id }) =>
        this.subscriptionService.deleteSubscription(id).pipe(
          map(() => {
            this.toastService.show("Subscription deleted successfully" , "success")
            return SubscriptionActions.deleteSubscriptionSuccess({ id })
          }),
          catchError((error) => {
            this.toastService.show("Failed to delete subscription", "error")
            return of(SubscriptionActions.deleteSubscriptionFailure({ error }))
          }),
        ),
      ),
    ),
  )

  deleteSubscriptionSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SubscriptionActions.deleteSubscriptionSuccess),
        tap(() => {
          this.router.navigate(["/subscriptions"])
        }),
      ),
    { dispatch: false },
  )

  confirmSubscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubscriptionActions.confirmSubscription),
      switchMap(({ id, adminNote }) =>
        this.subscriptionService.confirmSubscription(id, adminNote).pipe(
          map((subscription) => {
            this.toastService.show("Subscription confirmed successfully" , "success")
            return SubscriptionActions.confirmSubscriptionSuccess({ subscription })
          }),
          catchError((error) => {
            this.toastService.show("Failed to confirm subscription", "error")
            return of(SubscriptionActions.confirmSubscriptionFailure({ error }))
          }),
        ),
      ),
    ),
  )

  refuseSubscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubscriptionActions.refuseSubscription),
      switchMap(({ id, adminNote }) =>
        this.subscriptionService.refuseSubscription(id, adminNote).pipe(
          map((subscription) => {
            this.toastService.show("Subscription refused successfully" , "success")
            return SubscriptionActions.refuseSubscriptionSuccess({ subscription })
          }),
          catchError((error) => {
            this.toastService.show("Failed to refuse subscription" , "error")
            return of(SubscriptionActions.refuseSubscriptionFailure({ error }))
          }),
        ),
      ),
    ),
  )

  updatePaymentStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubscriptionActions.updatePaymentStatus),
      switchMap(({ id, status }) =>
        this.subscriptionService.updatePaymentStatus(id, status).pipe(
          map((subscription) => {
            this.toastService.show("Payment status updated successfully" , "success")
            return SubscriptionActions.updatePaymentStatusSuccess({ subscription })
          }),
          catchError((error) => {
            this.toastService.show("Failed to update payment status", "error")
            return of(SubscriptionActions.updatePaymentStatusFailure({ error }))
          }),
        ),
      ),
    ),
  )
}

