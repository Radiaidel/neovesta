import { HttpClient, HttpParams } from "@angular/common/http"
import { Injectable, inject } from "@angular/core"
import type { Observable } from "rxjs"
import { environment } from "../../environments/environment"
import type { PageResponse } from "../models/common.model"
import type { Subscription, SubscriptionFilters, SubscriptionRequest } from "../models/subscription.model"

@Injectable({
  providedIn: "root",
})
export class SubscriptionService {
  private http = inject(HttpClient)
  private apiUrl = `${environment.apiUrl}/api/v1/subscriptions`

  getAllSubscriptions(filters: SubscriptionFilters): Observable<PageResponse<Subscription>> {
    let params = new HttpParams()
      .set("page", filters.page.toString())
      .set("size", filters.size.toString())
      .set("sortBy", filters.sortBy)
      .set("sortDir", filters.sortDir)

    if (filters.userId) {
      params = params.set("userId", filters.userId)
    }

    if (filters.featureId) {
      params = params.set("featureId", filters.featureId)
    }

    if (filters.residenceId) {
      params = params.set("residenceId", filters.residenceId)
    }

    if (filters.type) {
      params = params.set("type", filters.type)
    }

    if (filters.paymentStatus) {
      params = params.set("paymentStatus", filters.paymentStatus)
    }

    if (filters.isActive !== undefined) {
      params = params.set("isActive", filters.isActive.toString())
    }

    if (filters.isConfirmedByAdmin !== undefined) {
      params = params.set("isConfirmedByAdmin", filters.isConfirmedByAdmin.toString())
    }

    if (filters.startDateFrom) {
      params = params.set("startDateFrom", filters.startDateFrom)
    }

    if (filters.startDateTo) {
      params = params.set("startDateTo", filters.startDateTo)
    }

    if (filters.endDateFrom) {
      params = params.set("endDateFrom", filters.endDateFrom)
    }

    if (filters.endDateTo) {
      params = params.set("endDateTo", filters.endDateTo)
    }

    if (filters.search) {
      params = params.set("search", filters.search)
    }

    return this.http.get<PageResponse<Subscription>>(this.apiUrl, { params })
  }

  getSubscriptionById(id: string): Observable<Subscription> {
    return this.http.get<Subscription>(`${this.apiUrl}/${id}`)
  }

  getSubscriptionsByUser(userId: string): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.apiUrl}/user/${userId}`)
  }

  getSubscriptionsByFeature(featureId: string): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.apiUrl}/feature/${featureId}`)
  }

  getActiveSubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.apiUrl}/active`)
  }

  getConfirmedSubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.apiUrl}/confirmed`)
  }

  getSubscriptionsByPeriod(start: string, end: string): Observable<Subscription[]> {
    const params = new HttpParams().set("start", start).set("end", end)
    return this.http.get<Subscription[]>(`${this.apiUrl}/period`, { params })
  }

  createSubscription(subscription: SubscriptionRequest): Observable<Subscription> {
    return this.http.post<Subscription>(this.apiUrl, subscription)
  }

  updateSubscription(id: string, subscription: Partial<SubscriptionRequest>): Observable<Subscription> {
    return this.http.put<Subscription>(`${this.apiUrl}/${id}`, subscription)
  }

  deleteSubscription(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

  confirmSubscription(id: string, adminNote: string): Observable<Subscription> {
    const params = new HttpParams().set("adminNote", adminNote)
    return this.http.patch<Subscription>(`${this.apiUrl}/${id}/confirm`, null, { params })
  }

  refuseSubscription(id: string, adminNote: string): Observable<Subscription> {
    const params = new HttpParams().set("adminNote", adminNote)
    return this.http.patch<Subscription>(`${this.apiUrl}/${id}/refuse`, null, { params })
  }

  updatePaymentStatus(id: string, status: string): Observable<Subscription> {
    const params = new HttpParams().set("status", status)
    return this.http.patch<Subscription>(`${this.apiUrl}/${id}/payment-status`, null, { params })
  }
}

