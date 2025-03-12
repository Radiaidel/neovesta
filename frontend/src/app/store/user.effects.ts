import { Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { of } from "rxjs"
import { catchError, map, mergeMap, switchMap, tap } from "rxjs/operators"
import { UserService } from "../services/user.service"
import * as UserActions from "./user.actions"
import { Router } from "@angular/router"
import { AuthService } from "../services/auth.service"
import { User } from "../models/user.model"

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private router: Router,
    private authService:AuthService
  ) { }

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      mergeMap(({ request }) =>
        this.userService.searchUsers(request).pipe(
          map((users) => UserActions.loadUsersSuccess({ users })),
          catchError((error) => of(UserActions.loadUsersFailure({ error }))),
        ),
      ),
    ),
  )

  loadUserById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserById),
      mergeMap(({ userId }) =>
        this.userService.getUserById(userId).pipe(
          map((user) => UserActions.loadUserByIdSuccess({ user })),
          catchError((error) => of(UserActions.loadUserByIdFailure({ error }))),
        ),
      ),
    ),
  )

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.createUser),
      switchMap(({ user }: { user: any }) =>
        this.userService.createUser(user).pipe(
          map(createdUser => {
            return UserActions.createUserSuccess({ user: createdUser });
          }),
          catchError(error => {
            return of(
              UserActions.createUserFailure({ error }),
              UserActions.resetCreatedUser()
            );
          })
        )
      )
    )
  )
  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      mergeMap(({ userId, user }) =>
        this.userService.updateUser(userId, user).pipe(
          map((updatedUser) => UserActions.updateUserSuccess({ user: updatedUser })),
          catchError((error) => of(UserActions.updateUserFailure({ error }))),
        ),
      ),
    ),
  )

  toggleUserStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.toggleUserStatus),
      mergeMap(({ userId }) =>
        this.userService.toggleUserStatus(userId).pipe(
          map(() => UserActions.toggleUserStatusSuccess({ userId })),
          catchError((error) => of(UserActions.toggleUserStatusFailure({ error }))),
        ),
      ),
    ),
  )

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUser),
      mergeMap(({ userId }) =>
        this.userService.deleteUser(userId).pipe(
          map(() => UserActions.deleteUserSuccess({ userId })),
          catchError((error) => of(UserActions.deleteUserFailure({ error }))),
        ),
      ),
    ),
  )

  loadCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadCurrentUser),
      switchMap(() => {
        const currentUserExist: User | null = this.authService?.getCurrentUser();
        return currentUserExist
          ? of(UserActions.loadCurrentUserSuccess({ user: currentUserExist }))
          : of(UserActions.loadCurrentUserFailure({ error: 'No current user found' }));
      }),
    ),
  )

  // updateUser$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(UserActions.updateUser),
  //     switchMap(({ id, request }) =>
  //       this.userService.updateUser(id, request).pipe(
  //         map((user) => UserActions.updateUserSuccess({ user })),
  //         catchError((error) => of(UserActions.updateUserFailure({ error }))),
  //       ),
  //     ),
  //   ),
  // )

  updatePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updatePassword),
      switchMap(({ id, request }) =>
        this.userService.updatePassword(id, request).pipe(
          map((user) => UserActions.updatePasswordSuccess({ user })),
          catchError((error) => of(UserActions.updatePasswordFailure({ error }))),
        ),
      ),
    ),
  )


  // Rediriger vers la page de connexion après la suppression du compte
  deleteUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.deleteUserSuccess),
        tap(() => {
          this.authService.logout();
          this.router.navigate(["/login"])
        }),
      ),
    { dispatch: false },
  )

}

