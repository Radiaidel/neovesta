import { createFeatureSelector, createSelector } from "@ngrx/store"
import type { SubscriptionState } from "./subscription.reducer"

export const selectSubscriptionState = createFeatureSelector<SubscriptionState>("subscriptions")

export const selectAllSubscriptions = createSelector(selectSubscriptionState, (state) => state.subscriptions)

export const selectSelectedSubscription = createSelector(selectSubscriptionState, (state) => state.selectedSubscription)

export const selectSubscriptionLoading = createSelector(selectSubscriptionState, (state) => state.loading)

export const selectSubscriptionError = createSelector(selectSubscriptionState, (state) => state.error)

export const selectSubscriptionFilters = createSelector(selectSubscriptionState, (state) => state.filters)

export const selectSubscriptionTotalElements = createSelector(
  selectAllSubscriptions,
  (subscriptions) => subscriptions?.totalElements || 0,
)

export const selectSubscriptionTotalPages = createSelector(
  selectAllSubscriptions,
  (subscriptions) => subscriptions?.totalPages || 0,
)

export const selectSubscriptionCurrentPage = createSelector(
  selectAllSubscriptions,
  (subscriptions) => subscriptions?.number || 0,
)

export const selectSubscriptionPageSize = createSelector(
  selectAllSubscriptions,
  (subscriptions) => subscriptions?.size || 10,
)

export const selectSubscriptionIsFirstPage = createSelector(selectAllSubscriptions, (subscriptions) =>
  subscriptions?.first !== undefined ? subscriptions.first : subscriptions?.number === 0,
)

export const selectSubscriptionIsLastPage = createSelector(selectAllSubscriptions, (subscriptions) =>
  subscriptions?.last !== undefined
    ? subscriptions.last
    : (subscriptions?.number || 0) >= (subscriptions?.totalPages || 1) - 1,
)

