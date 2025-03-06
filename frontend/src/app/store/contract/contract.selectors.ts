import { createFeatureSelector, createSelector } from "@ngrx/store"
import type { ContractState } from "./contract.reducer"

export const selectContractState = createFeatureSelector<ContractState>("contract")

export const selectAllContracts = createSelector(selectContractState, (state) => state.contracts)

export const selectSelectedContract = createSelector(selectContractState, (state) => state.selectedContract)

export const selectContractLoading = createSelector(selectContractState, (state) => state.loading)

export const selectContractError = createSelector(selectContractState, (state) => state.error)

export const selectContractFilters = createSelector(selectContractState, (state) => state.filters)

export const selectContractTotalElements = createSelector(
  selectAllContracts,
  (contracts) => contracts?.totalElements || 0,
)

export const selectContractTotalPages = createSelector(selectAllContracts, (contracts) => contracts?.totalPages || 0)

export const selectContractCurrentPage = createSelector(selectAllContracts, (contracts) => contracts?.number || 0)

export const selectContractPageSize = createSelector(selectAllContracts, (contracts) => contracts?.size || 10)

export const selectContractIsFirstPage = createSelector(selectAllContracts, (contracts) =>
  contracts?.first !== undefined ? contracts.first : contracts?.number === 0,
)

export const selectContractIsLastPage = createSelector(selectAllContracts, (contracts) =>
  contracts?.last !== undefined ? contracts.last : (contracts?.number || 0) >= (contracts?.totalPages || 1) - 1,
)

