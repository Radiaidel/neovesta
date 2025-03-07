import { createAction, props } from "@ngrx/store"
import type { PageResponse } from "../../models/common.model"
import type { Subscription, SubscriptionFilters, SubscriptionRequest } from "../../models/subscription.model"

// Load subscriptions
export const loadSubscriptions = createAction(
  "[Subscription] Load Subscriptions",
  props<{ filters: SubscriptionFilters }>(),
)

export const loadSubscriptionsSuccess = createAction(
  "[Subscription] Load Subscriptions Success",
  props<{ response: PageResponse<Subscription> }>(),
)

export const loadSubscriptionsFailure = createAction(
  "[Subscription] Load Subscriptions Failure",
  props<{ error: any }>(),
)

// Load single subscription
export const loadSubscription = createAction("[Subscription] Load Subscription", props<{ id: string }>())

export const loadSubscriptionSuccess = createAction(
  "[Subscription] Load Subscription Success",
  props<{ subscription: Subscription }>(),
)

export const loadSubscriptionFailure = createAction("[Subscription] Load Subscription Failure", props<{ error: any }>())

// Create subscription
export const createSubscription = createAction(
  "[Subscription] Create Subscription",
  props<{ subscription: SubscriptionRequest }>(),
)

export const createSubscriptionSuccess = createAction(
  "[Subscription] Create Subscription Success",
  props<{ subscription: Subscription }>(),
)

export const createSubscriptionFailure = createAction(
  "[Subscription] Create Subscription Failure",
  props<{ error: any }>(),
)

// Update subscription
export const updateSubscription = createAction(
  "[Subscription] Update Subscription",
  props<{ id: string; subscription: Partial<SubscriptionRequest> }>(),
)

export const updateSubscriptionSuccess = createAction(
  "[Subscription] Update Subscription Success",
  props<{ subscription: Subscription }>(),
)

export const updateSubscriptionFailure = createAction(
  "[Subscription] Update Subscription Failure",
  props<{ error: any }>(),
)

// Delete subscription
export const deleteSubscription = createAction("[Subscription] Delete Subscription", props<{ id: string }>())

export const deleteSubscriptionSuccess = createAction(
  "[Subscription] Delete Subscription Success",
  props<{ id: string }>(),
)

export const deleteSubscriptionFailure = createAction(
  "[Subscription] Delete Subscription Failure",
  props<{ error: any }>(),
)

// Confirm subscription
export const confirmSubscription = createAction(
  "[Subscription] Confirm Subscription",
  props<{ id: string; adminNote: string }>(),
)

export const confirmSubscriptionSuccess = createAction(
  "[Subscription] Confirm Subscription Success",
  props<{ subscription: Subscription }>(),
)

export const confirmSubscriptionFailure = createAction(
  "[Subscription] Confirm Subscription Failure",
  props<{ error: any }>(),
)

// Refuse subscription
export const refuseSubscription = createAction(
  "[Subscription] Refuse Subscription",
  props<{ id: string; adminNote: string }>(),
)

export const refuseSubscriptionSuccess = createAction(
  "[Subscription] Refuse Subscription Success",
  props<{ subscription: Subscription }>(),
)

export const refuseSubscriptionFailure = createAction(
  "[Subscription] Refuse Subscription Failure",
  props<{ error: any }>(),
)

// Update payment status
export const updatePaymentStatus = createAction(
  "[Subscription] Update Payment Status",
  props<{ id: string; status: string }>(),
)

export const updatePaymentStatusSuccess = createAction(
  "[Subscription] Update Payment Status Success",
  props<{ subscription: Subscription }>(),
)

export const updatePaymentStatusFailure = createAction(
  "[Subscription] Update Payment Status Failure",
  props<{ error: any }>(),
)

// Reset selected subscription
export const resetSelectedSubscription = createAction("[Subscription] Reset Selected Subscription")

// Set filters
export const setSubscriptionFilters = createAction(
  "[Subscription] Set Subscription Filters",
  props<{ filters: Partial<SubscriptionFilters> }>(),
)

export const resetSubscriptionFilters = createAction("[Subscription] Reset Subscription Filters")

// Namespace for easier imports
export const SubscriptionActions = {
  loadSubscriptions,
  loadSubscriptionsSuccess,
  loadSubscriptionsFailure,
  loadSubscription,
  loadSubscriptionSuccess,
  loadSubscriptionFailure,
  createSubscription,
  createSubscriptionSuccess,
  createSubscriptionFailure,
  updateSubscription,
  updateSubscriptionSuccess,
  updateSubscriptionFailure,
  deleteSubscription,
  deleteSubscriptionSuccess,
  deleteSubscriptionFailure,
  confirmSubscription,
  confirmSubscriptionSuccess,
  confirmSubscriptionFailure,
  refuseSubscription,
  refuseSubscriptionSuccess,
  refuseSubscriptionFailure,
  updatePaymentStatus,
  updatePaymentStatusSuccess,
  updatePaymentStatusFailure,
  resetSelectedSubscription,
  setSubscriptionFilters,
  resetSubscriptionFilters,
}

