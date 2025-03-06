import { HttpClient, HttpParams } from "@angular/common/http"
import { Injectable, inject } from "@angular/core"
import type { Observable } from "rxjs"
import { environment } from "../../environments/environment"
import { PageResponse } from "../models/common.model"
import type { Contract, ContractFilters, ContractRequest } from "../models/contract.model"

@Injectable({
  providedIn: "root",
})
export class ContractService {
  private http = inject(HttpClient)
  private apiUrl = `${environment.apiUrl}/api/v1/contracts`

  getAllContracts(filters: ContractFilters): Observable<PageResponse<Contract>> {
    let params = new HttpParams()
      .set("page", filters.page.toString())
      .set("size", filters.size.toString())
      .set("sortBy", filters.sortBy)
      .set("sortDir", filters.sortDir)

    if (filters.residentId) {
      params = params.set("residentId", filters.residentId)
    }

    if (filters.residenceId) {
      params = params.set("residenceId", filters.residenceId)
    }

    if (filters.contractType) {
      params = params.set("contractType", filters.contractType)
    }

    if (filters.status) {
      params = params.set("status", filters.status)
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

    return this.http.get<PageResponse<Contract>>(this.apiUrl, { params })
  }

  getContractById(id: string): Observable<Contract> {
    return this.http.get<Contract>(`${this.apiUrl}/${id}`)
  }

  getContractsByResident(residentId: string): Observable<Contract[]> {
    return this.http.get<Contract[]>(`${this.apiUrl}/resident/${residentId}`)
  }

  getContractsByResidence(residenceId: string): Observable<Contract[]> {
    return this.http.get<Contract[]>(`${this.apiUrl}/residence/${residenceId}`)
  }

  createContract(contract: ContractRequest): Observable<Contract> {
    return this.http.post<Contract>(this.apiUrl, contract)
  }

  updateContract(id: string, contract: Partial<ContractRequest>): Observable<Contract> {
    return this.http.put<Contract>(`${this.apiUrl}/${id}`, contract)
  }

  deleteContract(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
}

