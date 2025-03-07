import { HttpClient, HttpParams } from "@angular/common/http"
import { Injectable, inject } from "@angular/core"
import type { Observable } from "rxjs"
import { environment } from "../../environments/environment"
import type { Feature, FeatureFilters, FeatureRequest } from "../models/feature.model"
import { PageResponse } from "../models/common.model"

@Injectable({
  providedIn: "root",
})
export class FeatureService {
  private http = inject(HttpClient)
  private apiUrl = `${environment.apiUrl}/api/v1/features`

  getAllFeatures(filters: FeatureFilters): Observable<PageResponse<Feature>> {
    let params = new HttpParams()
      .set("page", filters.page.toString())
      .set("size", filters.size.toString())
      .set("sortBy", filters.sortBy)
      .set("sortDir", filters.sortDir)

    if (filters.residenceName) {
      params = params.set("residenceName", filters.residenceName)
    }

    if (filters.featureType) {
      params = params.set("featureType", filters.featureType)
    }

    if (filters.featureCategory) {
      params = params.set("featureCategory", filters.featureCategory)
    }

    if (filters.active !== undefined) {
      params = params.set("active", filters.active.toString())
    }

    if (filters.search) {
      params = params.set("search", filters.search)
    }

    return this.http.get<PageResponse<Feature>>(this.apiUrl, { params })
  }

  getFeatureById(id: string): Observable<Feature> {
    return this.http.get<Feature>(`${this.apiUrl}/${id}`)
  }

  createFeature(feature: FeatureRequest, image?: File): Observable<Feature> {
    const formData = new FormData()

    formData.append("feature", JSON.stringify(feature))

    if (image) {
      formData.append("image", image)
    }

    return this.http.post<Feature>(this.apiUrl, formData)
  }

  updateFeature(id: string, feature: FeatureRequest, image?: File): Observable<Feature> {
    const formData = new FormData()

    formData.append("feature", JSON.stringify(feature))

    if (image) {
      formData.append("image", image)
    }

    return this.http.put<Feature>(`${this.apiUrl}/${id}`, formData)
  }

  deleteFeature(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

  getFeaturesByResidence(residenceName: string, page = 0, size = 10): Observable<PageResponse<Feature>> {
    const params = new HttpParams()
      .set("residenceName", residenceName)
      .set("page", page.toString())
      .set("size", size.toString())

    return this.http.get<PageResponse<Feature>>(`${this.apiUrl}/by-residence`, { params })
  }
}

