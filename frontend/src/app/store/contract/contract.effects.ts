import { Injectable, inject } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { catchError, map, mergeMap, of, tap } from "rxjs"
import { ContractService } from "../../services/contract.service"
import * as ContractActions from "./contract.actions"
import { Router } from "@angular/router"
import { ToastService } from "../../services/toast.service"

@Injectable()
export class ContractEffects {
  private actions$ = inject(Actions)
  private contractService = inject(ContractService)
  private router = inject(Router)
  private toastService = inject(ToastService)

  loadContracts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContractActions.loadContracts),
      mergeMap(({ filters }) =>
        this.contractService.getAllContracts(filters).pipe(
          map((response) => ContractActions.loadContractsSuccess({ response })),
          catchError((error) => of(ContractActions.loadContractsFailure({ error }))),
        ),
      ),
    ),
  )

  loadContract$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContractActions.loadContract),
      mergeMap(({ id }) =>
        this.contractService.getContractById(id).pipe(
          map((contract) => ContractActions.loadContractSuccess({ contract })),
          catchError((error) => of(ContractActions.loadContractFailure({ error }))),
        ),
      ),
    ),
  )

  createContract$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContractActions.createContract),
      mergeMap(({ contract }) =>
        this.contractService.createContract(contract).pipe(
          map((newContract) => ContractActions.createContractSuccess({ contract: newContract })),
          catchError((error) => of(ContractActions.createContractFailure({ error }))),
        ),
      ),
    ),
  )

  createContractSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ContractActions.createContractSuccess),
        tap(({ contract }) => {
          this.toastService.show("Contract created successfully", "success")
          this.router.navigate(["/contracts", contract.id])
        }),
      ),
    { dispatch: false },
  )

  updateContract$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContractActions.updateContract),
      mergeMap(({ id, contract }) =>
        this.contractService.updateContract(id, contract).pipe(
          map((updatedContract) => ContractActions.updateContractSuccess({ contract: updatedContract })),
          catchError((error) => of(ContractActions.updateContractFailure({ error }))),
        ),
      ),
    ),
  )

  updateContractSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ContractActions.updateContractSuccess),
        tap(({ contract }) => {
          this.toastService.show("Contract updated successfully", "success")
          this.router.navigate(["/contracts", contract.id])
        }),
      ),
    { dispatch: false },
  )

  deleteContract$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContractActions.deleteContract),
      mergeMap(({ id }) =>
        this.contractService.deleteContract(id).pipe(
          map(() => ContractActions.deleteContractSuccess({ id })),
          catchError((error) => of(ContractActions.deleteContractFailure({ error }))),
        ),
      ),
    ),
  )

  deleteContractSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ContractActions.deleteContractSuccess),
        tap(() => {
          this.toastService.show("Contract deleted successfully", "success")
          this.router.navigate(["/contracts"])
        }),
      ),
    { dispatch: false },
  )

  handleError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ContractActions.loadContractsFailure,
          ContractActions.loadContractFailure,
          ContractActions.createContractFailure,
          ContractActions.updateContractFailure,
          ContractActions.deleteContractFailure,
        ),
        tap(({ error }) => {
          const message = error?.error?.message || "An error occurred"
          this.toastService.show(message, "error")
        }),
      ),
    { dispatch: false },
  )
}

