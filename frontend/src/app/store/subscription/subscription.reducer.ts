import { createReducer, on } from "@ngrx/store"
import type { PageResponse } from "../../models/common.model"
import type { Subscription, SubscriptionFilters } from "../../models/subscription.model"
import * as SubscriptionActions from "./subscription.actions"

export interface SubscriptionState {
  subscriptions: PageResponse<Subscription> | null
  selectedSubscription: Subscription | null
  loading: boolean
  error: any
  filters: SubscriptionFilters
}

export const initialFilters: SubscriptionFilters = {
  page: 0,
  size: 10,
  sortBy: "startDate",
  sortDir: "desc",
  search: "",
  startDateFrom: "",
  startDateTo: "",
  endDateFrom: "",
  endDateTo: "",
}

export const initialState: SubscriptionState = {
  subscriptions: null,
  selectedSubscription: null,
  loading: false,
  error: null,
  filters: initialFilters,
}

export const subscriptionReducer = createReducer(
  initialState,

  // Load subscriptions
  on(SubscriptionActions.loadSubscriptions, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(SubscriptionActions.loadSubscriptionsSuccess, (state, { response }) => ({
    ...state,
    subscriptions: response,
    loading: false,
  })),
  on(SubscriptionActions.loadSubscriptionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load single subscription
  on(SubscriptionActions.loadSubscription, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(SubscriptionActions.loadSubscriptionSuccess, (state, { subscription }) => ({
    ...state,
    selectedSubscription: subscription,
    loading: false,
  })),
  on(SubscriptionActions.loadSubscriptionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create subscription
  on(SubscriptionActions.createSubscription, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(SubscriptionActions.createSubscriptionSuccess, (state, { subscription }) => ({
    ...state,
    loading: false,
  })),
  on(SubscriptionActions.createSubscriptionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update subscription
  on(SubscriptionActions.updateSubscription, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(SubscriptionActions.updateSubscriptionSuccess, (state, { subscription }) => ({
    ...state,
    selectedSubscription: subscription,
    loading: false,
  })),
  on(SubscriptionActions.updateSubscriptionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete subscription
  on(SubscriptionActions.deleteSubscription, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(SubscriptionActions.deleteSubscriptionSuccess, (state, { id }) => {
    // If we have subscriptions loaded, filter out the deleted one
    const updatedSubscriptions = state.subscriptions
      ? {
          ...state.subscriptions,
          content: state.subscriptions.content.filter((s: Subscription) => s.id !== id),
          totalElements: state.subscriptions.totalElements - 1,
        }
      : null

    return {
      ...state,
      subscriptions: updatedSubscriptions,
      loading: false,
    }
  }),
  on(SubscriptionActions.deleteSubscriptionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Confirm subscription
  on(SubscriptionActions.confirmSubscription, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(SubscriptionActions.confirmSubscriptionSuccess, (state, { subscription }) => {
    // Update the subscription in the list if it exists
    const updatedSubscriptions = state.subscriptions
      ? {
          ...state.subscriptions,
          content: state.subscriptions.content.map((s: Subscription) => (s.id === subscription.id ? subscription : s)),
        }
      : null

    return {
      ...state,
      subscriptions: updatedSubscriptions,
      selectedSubscription: subscription,
      loading: false,
    }
  }),
  on(SubscriptionActions.confirmSubscriptionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Refuse subscription
  on(SubscriptionActions.refuseSubscription, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(SubscriptionActions.refuseSubscriptionSuccess, (state, { subscription }) => {
    // Update the subscription in the list if it exists
    const updatedSubscriptions = state.subscriptions
      ? {
          ...state.subscriptions,
          content: state.subscriptions.content.map((s: Subscription) => (s.id === subscription.id ? subscription : s)),
        }
      : null

    return {
      ...state,
      subscriptions: updatedSubscriptions,
      selectedSubscription: subscription,
      loading: false,
    }
  }),
  on(SubscriptionActions.refuseSubscriptionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update payment status
  on(SubscriptionActions.updatePaymentStatus, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(SubscriptionActions.updatePaymentStatusSuccess, (state, { subscription }) => {
    // Update the subscription in the list if it exists
    const updatedSubscriptions = state.subscriptions
      ? {
          ...state.subscriptions,
          content: state.subscriptions.content.map((s: Subscription) => (s.id === subscription.id ? subscription : s)),
        }
      : null

    return {
      ...state,
      subscriptions: updatedSubscriptions,
      selectedSubscription: subscription,
      loading: false,
    }
  }),
  on(SubscriptionActions.updatePaymentStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Reset selected subscription
  on(SubscriptionActions.resetSelectedSubscription, (state) => ({
    ...state,
    selectedSubscription: null,
  })),

  // Set filters
  on(SubscriptionActions.setSubscriptionFilters, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters },
  })),
  on(SubscriptionActions.resetSubscriptionFilters, (state) => ({
    ...state,
    filters: initialFilters,
  })),
)

