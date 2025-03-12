import { Injectable, inject } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { catchError, tap, throwError, type Observable } from "rxjs"
import type {
  ProfileUser,
  ProfileUpdateRequest,
  ProfilePasswordUpdateRequest,
  ProfileImageUploadResponse,
  ProfileResidence,
} from "../models/profile.model"
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  private http = inject(HttpClient)
  private apiUrl = `${environment.apiUrl}/api/v1`

  getUserProfile(id: string): Observable<ProfileUser> {
    return this.http.get<ProfileUser>(`${this.apiUrl}/users/${id}`)
  }

  updateUserProfile(id: string, request: ProfileUpdateRequest | FormData): Observable<ProfileUser> {
    if (request instanceof FormData) {
      return this.http.put<ProfileUser>(`${this.apiUrl}/users/${id}`, request);
    }
    return this.http.put<ProfileUser>(`${this.apiUrl}/users/${id}`, request);
  }

  updatePassword(id: string, request: { currentPassword: string; newPassword: string }): Observable<any> {
    console.log(`Making password update request to: ${this.apiUrl}/users/${id}/password`);
    console.log("Request payload:", request);
    
    return this.http.put<any>(`${this.apiUrl}/users/${id}/password`, request)
      .pipe(
        tap(response => console.log("Password update success response:", response)),
        catchError(error => {
          console.error("Password update HTTP error:", error);
          return throwError(() => error);
        })
      );
  }

  uploadProfileImage(id: string, image: File): Observable<ProfileImageUploadResponse> {
    const formData = new FormData()
    formData.append("profilePicture", image);
    return this.http.put<ProfileImageUploadResponse>(`${this.apiUrl}/users/${id}`, formData);
  }

  getResidenceByManager(managerId: string): Observable<ProfileResidence> {
    return this.http.get<ProfileResidence>(`${this.apiUrl}/residences/manager/${managerId}`)
  }

  updateResidence(residenceId: string, request: any): Observable<ProfileResidence> {
    if (request.images || request.documents) {
      const formData = new FormData()

      const requestData = { ...request }
      delete requestData.images
      delete requestData.documents
      formData.append("data", JSON.stringify(requestData))

      if (request.images && request.images.length) {
        request.images.forEach((image: File) => {
          formData.append("images", image)
        })
      }

      if (request.documents && request.documents.length) {
        request.documents.forEach((doc: File) => {
          formData.append("documents", doc)
        })
      }

      return this.http.put<ProfileResidence>(`${this.apiUrl}/residences/${residenceId}`, formData)
    } else {
      return this.http.put<ProfileResidence>(`${this.apiUrl}/residences/${residenceId}`, request)
    }
  }
}

