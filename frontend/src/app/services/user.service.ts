import { Injectable } from "@angular/core"
import {  HttpClient, HttpParams } from "@angular/common/http"
import  { Observable } from "rxjs"
import  {
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UpdatePasswordRequest,
  UserSearchRequest,
  PageResponse,
} from "../models/user.model"
import type { Role } from "../models/user.model"
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/v1/users`

  constructor(private http: HttpClient) {}

  createUser(user: CreateUserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.apiUrl, user)
  }

  getUserById(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`)
  }

  getUserByEmail(email: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/email/${email}`)
  }

  searchUsers(request: UserSearchRequest): Observable<PageResponse<UserResponse>> {
    let params = new HttpParams()
      .set("page", request.page?.toString() || "0")
      .set("size", request.size?.toString() || "10")
      .set("searchTerm", request.searchTerm ?? "") 
      
    if (request.searchTerm) {
      params = params.set("searchTerm", request.searchTerm)
    }

    if (request.role) {
      params = params.set("role", request.role)
    }

    return this.http.get<PageResponse<UserResponse>>(`${this.apiUrl}/search`, { params })
  }

  getUsersByRole(role: Role, page = 0, size = 10): Observable<PageResponse<UserResponse>> {
    const params = new HttpParams().set("page", page.toString()).set("size", size.toString())

    return this.http.get<PageResponse<UserResponse>>(`${this.apiUrl}/role/${role}`, { params })
  }

  getAllUsers(page = 0, size = 10): Observable<PageResponse<UserResponse>> {
    const params = new HttpParams().set("page", page.toString()).set("size", size.toString())

    return this.http.get<PageResponse<UserResponse>>(`${this.apiUrl}/all`, { params })
  }

  updateUser(id: string, user: UpdateUserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}`, user)
  }

  updatePassword(id: string, request: UpdatePasswordRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}/password`, request)
  }

  toggleUserStatus(id: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/toggle-status`, {})
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
}

