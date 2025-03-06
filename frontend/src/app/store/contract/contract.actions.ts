import { createAction, props } from "@ngrx/store"
import type { PageResponse } from "../../models/common.model"
import type { Contract, ContractFilters, ContractRequest } from "../../models/contract.model"

export const loadContracts = createAction("[Contract] Load Contracts", props<{ filters: ContractFilters }>())

export const loadContractsSuccess = createAction(
  "[Contract] Load Contracts Success",
  props<{ response: PageResponse<Contract> }>(),
)

export const loadContractsFailure = createAction("[Contract] Load Contracts Failure", props<{ error: any }>())

export const loadContract = createAction("[Contract] Load Contract", props<{ id: string }>())

export const loadContractSuccess = createAction("[Contract] Load Contract Success", props<{ contract: Contract }>())

export const loadContractFailure = createAction("[Contract] Load Contract Failure", props<{ error: any }>())

export const createContract = createAction("[Contract] Create Contract", props<{ contract: ContractRequest }>())

export const createContractSuccess = createAction("[Contract] Create Contract Success", props<{ contract: Contract }>())

export const createContractFailure = createAction("[Contract] Create Contract Failure", props<{ error: any }>())

export const updateContract = createAction(
  "[Contract] Update Contract",
  props<{ id: string; contract: Partial<ContractRequest> }>(),
)

export const updateContractSuccess = createAction("[Contract] Update Contract Success", props<{ contract: Contract }>())

export const updateContractFailure = createAction("[Contract] Update Contract Failure", props<{ error: any }>())

export const deleteContract = createAction("[Contract] Delete Contract", props<{ id: string }>())

export const deleteContractSuccess = createAction("[Contract] Delete Contract Success", props<{ id: string }>())

export const deleteContractFailure = createAction("[Contract] Delete Contract Failure", props<{ error: any }>())

export const resetSelectedContract = createAction("[Contract] Reset Selected Contract")

export const setContractFilters = createAction("[Contract] Set Filters", props<{ filters: Partial<ContractFilters> }>())

export const resetContractFilters = createAction("[Contract] Reset Filters")

export const ContractActions = {
  loadContracts,
  loadContractsSuccess,
  loadContractsFailure,
  loadContract,
  loadContractSuccess,
  loadContractFailure,
  createContract,
  createContractSuccess,
  createContractFailure,
  updateContract,
  updateContractSuccess,
  updateContractFailure,
  deleteContract,
  deleteContractSuccess,
  deleteContractFailure,
  resetSelectedContract,
  setContractFilters,
  resetContractFilters,
}

