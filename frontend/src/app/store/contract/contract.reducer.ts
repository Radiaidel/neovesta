import { createReducer, on } from "@ngrx/store"
import type { PageResponse } from "../../models/common.model"
import type { Contract, ContractFilters } from "../../models/contract.model"
import * as ContractActions from "./contract.actions"

export interface ContractState {
  contracts: PageResponse<Contract> | null
  selectedContract: Contract | null
  loading: boolean
  error: any
  filters: ContractFilters
}

export const initialFilters: ContractFilters = {
  page: 0,
  size: 10,
  sortBy: "createdAt",
  sortDir: "desc",
}

export const initialState: ContractState = {
  contracts: null,
  selectedContract: null,
  loading: false,
  error: null,
  filters: initialFilters,
}

export const contractReducer = createReducer(
  initialState,

  on(ContractActions.loadContracts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ContractActions.loadContractsSuccess, (state, { response }) => ({
    ...state,
    contracts: response,
    loading: false,
  })),
  on(ContractActions.loadContractsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ContractActions.loadContract, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ContractActions.loadContractSuccess, (state, { contract }) => ({
    ...state,
    selectedContract: contract,
    loading: false,
  })),
  on(ContractActions.loadContractFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ContractActions.createContract, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ContractActions.createContractSuccess, (state, { contract }) => ({
    ...state,
    loading: false,
  })),
  on(ContractActions.createContractFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ContractActions.updateContract, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ContractActions.updateContractSuccess, (state, { contract }) => ({
    ...state,
    selectedContract: contract,
    loading: false,
  })),
  on(ContractActions.updateContractFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ContractActions.deleteContract, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ContractActions.deleteContractSuccess, (state, { id }) => {
    const updatedContracts = state.contracts
      ? {
          ...state.contracts,
          content: state.contracts.content.filter((c) => c.id !== id),
          totalElements: state.contracts.totalElements - 1,
        }
      : null

    return {
      ...state,
      contracts: updatedContracts,
      loading: false,
    }
  }),
  on(ContractActions.deleteContractFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ContractActions.resetSelectedContract, (state) => ({
    ...state,
    selectedContract: null,
  })),

  on(ContractActions.setContractFilters, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters },
  })),
  on(ContractActions.resetContractFilters, (state) => ({
    ...state,
    filters: initialFilters,
  })),
)

