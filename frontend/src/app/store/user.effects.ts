import { Injectable } from "@angular/core"
import {  Actions, createEffect, ofType } from "@ngrx/effects"
import { of } from "rxjs"
import { catchError, map, mergeMap } from "rxjs/operators"
import  { UserService } from "../services/user.service"
import * as UserActions from "./user.actions"

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
  ) {}

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
      mergeMap(({ user }) =>
        this.userService.createUser(user).pipe(
          map((createdUser) => UserActions.createUserSuccess({ user: createdUser })),
          catchError((error) => of(UserActions.createUserFailure({ error }))),
        ),
      ),
    ),
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
}

