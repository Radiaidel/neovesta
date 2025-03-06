import { Injectable, inject } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { catchError, map, mergeMap, of, tap } from "rxjs"
import { FeatureService } from "../../services/feature.service"
import * as FeatureActions from "./feature.actions"
import { Router } from "@angular/router"
import { ToastService } from "../../services/toast.service"

@Injectable()
export class FeatureEffects {
  private actions$ = inject(Actions)
  private featureService = inject(FeatureService)
  private router = inject(Router)
  private toastService = inject(ToastService)

  loadFeatures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FeatureActions.loadFeatures),
      mergeMap(({ filters }) =>
        this.featureService.getAllFeatures(filters).pipe(
          map((response) => FeatureActions.loadFeaturesSuccess({ response })),
          catchError((error) => of(FeatureActions.loadFeaturesFailure({ error }))),
        ),
      ),
    ),
  )

  loadFeature$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FeatureActions.loadFeature),
      mergeMap(({ id }) =>
        this.featureService.getFeatureById(id).pipe(
          map((feature) => FeatureActions.loadFeatureSuccess({ feature })),
          catchError((error) => of(FeatureActions.loadFeatureFailure({ error }))),
        ),
      ),
    ),
  )

  createFeature$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FeatureActions.createFeature),
      mergeMap(({ featureUpload }) =>
        this.featureService.createFeature(featureUpload.feature, featureUpload.image).pipe(
          map((feature) => FeatureActions.createFeatureSuccess({ feature })),
          catchError((error) => of(FeatureActions.createFeatureFailure({ error }))),
        ),
      ),
    ),
  )

  createFeatureSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(FeatureActions.createFeatureSuccess),
        tap(({ feature }) => {
          this.toastService.show("Service created successfully", "success")
          this.router.navigate(["/features", feature.id])
        }),
      ),
    { dispatch: false },
  )

  updateFeature$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FeatureActions.updateFeature),
      mergeMap(({ id, featureUpload }) =>
        this.featureService.updateFeature(id, featureUpload.feature, featureUpload.image).pipe(
          map((feature) => FeatureActions.updateFeatureSuccess({ feature })),
          catchError((error) => of(FeatureActions.updateFeatureFailure({ error }))),
        ),
      ),
    ),
  )

  updateFeatureSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(FeatureActions.updateFeatureSuccess),
        tap(({ feature }) => {
          this.toastService.show("Service updated successfully", "success")
          this.router.navigate(["/features", feature.id])
        }),
      ),
    { dispatch: false },
  )

  deleteFeature$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FeatureActions.deleteFeature),
      mergeMap(({ id }) =>
        this.featureService.deleteFeature(id).pipe(
          map(() => FeatureActions.deleteFeatureSuccess({ id })),
          catchError((error) => of(FeatureActions.deleteFeatureFailure({ error }))),
        ),
      ),
    ),
  )

  deleteFeatureSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(FeatureActions.deleteFeatureSuccess),
        tap(() => {
          this.toastService.show("Service deleted successfully", "success")
          this.router.navigate(["/features"])
        }),
      ),
    { dispatch: false },
  )

  handleError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          FeatureActions.loadFeaturesFailure,
          FeatureActions.loadFeatureFailure,
          FeatureActions.createFeatureFailure,
          FeatureActions.updateFeatureFailure,
          FeatureActions.deleteFeatureFailure,
        ),
        tap(({ error }) => {
          const message = error?.error?.message || "An error occurred"
          this.toastService.show(message, "error")
        }),
      ),
    { dispatch: false },
  )
}

