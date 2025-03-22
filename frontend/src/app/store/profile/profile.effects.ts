import { Injectable, inject } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { of } from "rxjs"
import { catchError, map, switchMap, tap } from "rxjs/operators"
import { ProfileService } from "../../services/profile.service"
import { AuthService } from "../../services/auth.service"
import { ToastService } from "../../services/toast.service"

import { ProfileActions } from "./profile.actions"
import { HttpErrorResponse } from "@angular/common/http"
import { Router } from "@angular/router"
import { ResidenceService } from "../../services/residence.service"

@Injectable()
export class ProfileEffects {
  private actions$ = inject(Actions)
  private profileService = inject(ProfileService)
  private authService = inject(AuthService)
  private residenceService = inject(ResidenceService)

  private toastr = inject(ToastService);
  private router = inject(Router);

  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.loadProfile),
      switchMap(({ id }) =>
        this.profileService.getUserProfile(id).pipe(
          map((user) => ProfileActions.loadProfileSuccess({ user })),
          catchError((error) => of(ProfileActions.loadProfileFailure({ error }))),
        ),
      ),
    ),
  )

  updatePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.updatePassword),
      switchMap(({ id, request }) =>
        this.profileService.updatePassword(id, request).pipe(
          map((user) => {
            this.toastr.show('Mot de passe mis à jour avec succès', 'success');
            this.authService.logout();
            this.router.navigate(['/login']);
            return ProfileActions.updatePasswordSuccess({ user: user }); // Add explicit user property
          }),
          catchError((error) => {
            if (error instanceof HttpErrorResponse) {
              if (error.status === 401) {
                this.toastr.show('Mot de passe actuel incorrect', 'error');
              } else {
                this.toastr.show('Une erreur est survenue: ' + 
                  (error.error?.message || 'Erreur inconnue'), 'error');
              }
            }
            return of(ProfileActions.updatePasswordFailure({ 
              error: error.error?.message || 'Erreur inconnue' 
            }));
          })
        )
      )
    )
  );

updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.updateProfile),
      switchMap(({ id, request }) => {
        return this.profileService.updateUserProfile(id, request).pipe(
          map((user) => ProfileActions.updateProfileSuccess({ user })),
          catchError((error) => of(ProfileActions.updateProfileFailure({ error }))),
        );
      }),
    ),
  );
  
  uploadProfileImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.uploadProfileImage),
      switchMap(({ id, image }) =>
        this.profileService.uploadProfileImage(id, image).pipe(
          map((response) => {
            return ProfileActions.uploadProfileImageSuccess({
              profilePictureUrl: response.profilePictureUrl,
            });
          }),
          catchError((error) => of(ProfileActions.uploadProfileImageFailure({ error }))),
        ),
      ),
    ),
  );
  
  loadResidenceProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.loadResidenceProfile),
      switchMap(({ managerId }) =>
        this.profileService.getResidenceByManager(managerId).pipe(
          map((residence) => ProfileActions.loadResidenceProfileSuccess({ residence })),
          catchError((error) => of(ProfileActions.loadResidenceProfileFailure({ error }))),
        ),
      ),
    ),
  )

  updateResidence$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.updateResidence),
      switchMap(({ residenceId, request, images }) =>
        this.residenceService.updateResidence(residenceId, request, images).pipe(
          map(updatedResidence => ProfileActions.updateResidenceSuccess({ residence: updatedResidence })),
          catchError(error => of(ProfileActions.updateResidenceFailure({ error })))
      )
    )
  ))
}

