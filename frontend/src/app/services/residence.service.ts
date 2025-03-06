import { HttpClient, HttpParams } from "@angular/common/http"
import { Injectable, inject } from "@angular/core"
import type { Observable } from "rxjs"
import type {
  CreateResidenceRequest,
  DocumentUpload,
  PageResponse,
  Residence,
  ResidenceFilters,
  UpdateResidenceRequest,
} from "../models/residence.model"
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class ResidenceService {
  private http = inject(HttpClient)
  private apiUrl = `${environment.apiUrl}/api/v1/residences`

  getAllResidences(filters: ResidenceFilters): Observable<PageResponse<Residence>> {
    let params = new HttpParams()
      .set("page", filters.page.toString())
      .set("size", filters.size.toString())
      .set("sortBy", filters.sortBy)
      .set("sortDir", filters.sortDir)

    if (filters.search) {
      params = params.set("search", filters.search)
    }

    if (filters.amenities && filters.amenities.length > 0) {
      filters.amenities.forEach((amenity) => {
        params = params.append("amenities", amenity)
      })
    }

    if (filters.minPrice !== undefined) {
      params = params.set("minPrice", filters.minPrice.toString())
    }

    if (filters.maxPrice !== undefined) {
      params = params.set("maxPrice", filters.maxPrice.toString())
    }

    if (filters.city) {
      params = params.set("city", filters.city)
    }

    return this.http.get<PageResponse<Residence>>(this.apiUrl, { params })
  }

  getResidenceById(id: string): Observable<Residence> {
    return this.http.get<Residence>(`${this.apiUrl}/${id}`)
  }

  getResidenceByManager(managerId: string): Observable<Residence> {
    return this.http.get<Residence>(`${this.apiUrl}/manager/${managerId}`)
  }

  createResidence(
    residence: CreateResidenceRequest,
    images: File[],
    documents: DocumentUpload[],
  ): Observable<Residence> {
    const formData = new FormData()

    // Add the JSON data
    formData.append("data", JSON.stringify(residence))

    // Add images
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append("images", image)
      })
    }

    // Add documents
    if (documents && documents.length > 0) {
      documents.forEach((doc) => {
        formData.append("documents", doc.file)
      })
    }

    return this.http.post<Residence>(this.apiUrl, formData)
  }

  updateResidence(
    id: string,
    residence: UpdateResidenceRequest,
    images?: File[],
    documents?: DocumentUpload[],
  ): Observable<Residence> {
    const formData = new FormData()

    // Add the JSON data
    formData.append("data", JSON.stringify(residence))

    // Add images if provided
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append("images", image)
      })
    }

    // Add documents if provided
    if (documents && documents.length > 0) {
      documents.forEach((doc) => {
        formData.append("documents", doc.file)
      })
    }

    return this.http.put<Residence>(`${this.apiUrl}/${id}`, formData)
  }

  deleteResidence(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

  getAllCities(page = 0, size = 20): Observable<PageResponse<string>> {
    const params = new HttpParams().set("page", page.toString()).set("size", size.toString())

    return this.http.get<PageResponse<string>>(`${this.apiUrl}/cities`, { params })
  }

  searchResidences(query: string, page = 0, size = 10): Observable<PageResponse<Residence>> {
    const params = new HttpParams().set("query", query).set("page", page.toString()).set("size", size.toString())

    return this.http.get<PageResponse<Residence>>(`${this.apiUrl}/search`, { params })
  }

  getResidencesByCity(city: string, page = 0, size = 10): Observable<PageResponse<Residence>> {
    const params = new HttpParams().set("page", page.toString()).set("size", size.toString())

    return this.http.get<PageResponse<Residence>>(`${this.apiUrl}/city/${city}`, { params })
  }
}

