import { HttpClient, HttpParams } from "@angular/common/http"
import { Injectable, inject } from "@angular/core"
import type { Observable } from "rxjs"
import { environment } from "../../environments/environment"
import type {
  PageResponse,
  Reservation,
  ReservationFilters,
  ReservationRequest,
  ReservationStatus,
} from "../models/reservation.model"

@Injectable({
  providedIn: "root",
})
export class ReservationService {
  private http = inject(HttpClient)
  private apiUrl = `${environment.apiUrl}/api/v1/reservations`

  getAllReservations(filters: ReservationFilters): Observable<PageResponse<Reservation>> {
    let params = new HttpParams()
      .set("page", filters.page.toString())
      .set("size", filters.size.toString())
      .set("sortBy", filters.sortBy)
      .set("sortDir", filters.sortDir)

    if (filters.residentId) {
      params = params.set("residentId", filters.residentId)
    }

    if (filters.featureId) {
      params = params.set("featureId", filters.featureId)
    }

    if (filters.status) {
      params = params.set("status", filters.status)
    }

    if (filters.dateFilter) {
      params = params.set("dateFilter", filters.dateFilter)
    }

    if (filters.search) {
      params = params.set("search", filters.search)
    }

    return this.http.get<PageResponse<Reservation>>(this.apiUrl, { params })
  }

  getReservationById(id: string): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`)
  }

  getReservationsByStatus(status: ReservationStatus): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/status/${status}`)
  }

  getReservationsByDate(filter: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/date?filter=${filter}`)
  }

  getReservationsByResident(residentId: string): Observable<PageResponse<Reservation>> {
    const params = new HttpParams()
      .set("residentId", residentId)
      .set("page", "0")
      .set("size", "20")
      .set("sortBy", "requestedDate")
      .set("sortDir", "desc")

    return this.http.get<PageResponse<Reservation>>(this.apiUrl, { params })
  }

  createReservation(reservation: ReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, reservation)
  }

  updateReservation(id: string, reservation: ReservationRequest): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}`, reservation)
  }

  deleteReservation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

  confirmReservation(id: string, scheduledDate: string): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.apiUrl}/${id}/confirm`, null, {
      params: { scheduledDate },
    })
  }

  rejectReservation(id: string, adminNote: string): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.apiUrl}/${id}/reject`, null, {
      params: { adminNote },
    })
  }

  cancelReservation(id: string): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.apiUrl}/${id}/cancel`, null)
  }
}

