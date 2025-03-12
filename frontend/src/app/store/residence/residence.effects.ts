import { Injectable, inject } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { catchError, map, mergeMap, of, tap, switchMap } from "rxjs"
import { ResidenceService } from "../../services/residence.service"
import * as ResidenceActions from "./residence.actions"
import { Router } from "@angular/router"
import { ToastService } from "../../services/toast.service"
import { Residence } from "../../models/residence.model"
import { loadCurrentUser } from "../user.actions"
import { AuthService } from "../../services/auth.service"

@Injectable()
export class ResidenceEffects {
  private actions$ = inject(Actions)
  private residenceService = inject(ResidenceService)
  private router = inject(Router)
  private toastService = inject(ToastService)
  private authService = inject(AuthService)

  loadResidences$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResidenceActions.loadResidences),
      mergeMap(({ filters }) =>
        this.residenceService.getAllResidences(filters).pipe(
          map((response) => ResidenceActions.loadResidencesSuccess({ response })),
          catchError((error) => of(ResidenceActions.loadResidencesFailure({ error }))),
        ),
      ),
    ),
  )

  loadResidence$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResidenceActions.loadResidence),
      mergeMap(({ id }) =>
        this.residenceService.getResidenceById(id).pipe(
          map((residence) => ResidenceActions.loadResidenceSuccess({ residence })),
          catchError((error) => of(ResidenceActions.loadResidenceFailure({ error }))),
        ),
      ),
    ),
  )

  createResidence$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResidenceActions.createResidence),
      mergeMap(({ residence }) =>
        this.residenceService.createResidence(residence, [], []).pipe(
          map((newResidence) => ResidenceActions.createResidenceSuccess({ residence: newResidence })),
          catchError((error) => of(ResidenceActions.createResidenceFailure({ error }))),
        ),
      ),
    ),
  )

  createResidenceWithFiles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResidenceActions.createResidenceWithFiles),
      mergeMap(({ residence, images, documents }) =>
        this.residenceService.createResidence(residence, images, documents).pipe(
          map((newResidence) => ResidenceActions.createResidenceSuccess({ residence: newResidence })),
          catchError((error) => of(ResidenceActions.createResidenceFailure({ error }))),
        ),
      ),
    ),
  )

  createResidenceSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ResidenceActions.createResidenceSuccess),
        tap(({ residence }) => {
          this.toastService.show("Residence created successfully", "success")
          this.router.navigate(["/residences", residence.id])
        }),
      ),
    { dispatch: false },
  )

  updateResidence$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResidenceActions.updateResidence),
      mergeMap(({ id, residence }) =>
        this.residenceService.updateResidence(id, residence).pipe(
          map((updatedResidence) => ResidenceActions.updateResidenceSuccess({ residence: updatedResidence })),
          catchError((error) => of(ResidenceActions.updateResidenceFailure({ error }))),
        ),
      ),
    ),
  )

  updateResidenceWithFiles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResidenceActions.updateResidenceWithFiles),
      mergeMap(({ id, residence, images, documents }) =>
        this.residenceService.updateResidence(id, residence, images, documents).pipe(
          map((updatedResidence) => ResidenceActions.updateResidenceSuccess({ residence: updatedResidence })),
          catchError((error) => of(ResidenceActions.updateResidenceFailure({ error }))),
        ),
      ),
    ),
  )

  updateResidenceSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ResidenceActions.updateResidenceSuccess),
        tap(({ residence }) => {
          this.toastService.show("Residence updated successfully", "success")
          this.router.navigate(["/residences", residence.id])
        }),
      ),
    { dispatch: false },
  )

  deleteResidence$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResidenceActions.deleteResidence),
      mergeMap(({ id }) =>
        this.residenceService.deleteResidence(id).pipe(
          map(() => ResidenceActions.deleteResidenceSuccess({ id })),
          catchError((error) => of(ResidenceActions.deleteResidenceFailure({ error }))),
        ),
      ),
    ),
  )

  deleteResidenceSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ResidenceActions.deleteResidenceSuccess),
        tap(() => {
          this.toastService.show("Residence deleted successfully", "success")
          this.router.navigate(["/residences"])
        }),
      ),
    { dispatch: false },
  )

  loadCities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResidenceActions.loadCities),
      mergeMap(({ page, size }) =>
        this.residenceService.getAllCities(page, size).pipe(
          map((response) => ResidenceActions.loadCitiesSuccess({ response })),
          catchError((error) => of(ResidenceActions.loadCitiesFailure({ error }))),
        ),
      ),
    ),
  )
  loadManagerResidence$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResidenceActions.loadManagerResidence),
      switchMap(() => {
        const currentUser = this.authService.getCurrentUser();
        return this.residenceService.getResidenceByManager(currentUser!.id).pipe(
          map((residence: Residence) => ResidenceActions.loadManagerResidenceSuccess({ residence })),
          catchError((error) => of(ResidenceActions.loadManagerResidenceFailure({ error }))),
        )},
      ),
    ),
  )
  handleError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ResidenceActions.loadResidencesFailure,
          ResidenceActions.loadResidenceFailure,
          ResidenceActions.createResidenceFailure,
          ResidenceActions.updateResidenceFailure,
          ResidenceActions.deleteResidenceFailure,
          ResidenceActions.loadCitiesFailure,
        ),
        tap(({ error }) => {
          const message = error?.error?.message || "An error occurred"
          this.toastService.show(message, "error")
        }),
      ),
    { dispatch: false },
  )
}
