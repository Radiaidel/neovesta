import { Component, type OnDestroy, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormBuilder, type FormGroup, ReactiveFormsModule } from "@angular/forms"
import { Store } from "@ngrx/store"
import { type Observable, Subject, takeUntil } from "rxjs"
import { PageResponse } from "../../../models/common.model"
import {
  type Contract,
  type ContractFilters,
  ContractStatus,
  ContractType,
} from "../../../models/contract.model"
import { ContractActions } from "../../../store/contract/contract.actions"
import {
  selectAllContracts,
  selectContractCurrentPage,
  selectContractFilters,
  selectContractIsFirstPage,
  selectContractIsLastPage,
  selectContractLoading,
  selectContractTotalPages,
} from "../../../store/contract/contract.selectors"
import { ConfirmDialogComponent } from "../../ui/confirm-dialog/confirm-dialog.component"
import { LoadingSpinnerComponent } from "../../ui/loading-spinner/loading-spinner.component"
import { PaginationComponent } from "../../ui/pagination/pagination.component"
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
  selector: 'app-contract-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ConfirmDialogComponent,
    LoadingSpinnerComponent,
    PaginationComponent,
    HeaderComponent
],
  templateUrl: `./contract-list.component.html`,
})
export class ContractListComponent implements OnInit, OnDestroy {
  private store = inject(Store)
  private fb = inject(FormBuilder)
  private destroy$ = new Subject<void>()

  contracts$: Observable<PageResponse<Contract> | null> = this.store.select(selectAllContracts)
  loading$: Observable<boolean> = this.store.select(selectContractLoading)
  currentPage$: Observable<number> = this.store.select(selectContractCurrentPage)
  totalPages$: Observable<number> = this.store.select(selectContractTotalPages)
  isFirstPage$: Observable<boolean> = this.store.select(selectContractIsFirstPage)
  isLastPage$: Observable<boolean> = this.store.select(selectContractIsLastPage)

  filterForm: FormGroup
  showDeleteConfirm = false
  contractToDelete: Contract | null = null
  Math = Math
  ContractType = ContractType
  ContractStatus = ContractStatus
  viewMode: "table" | "grid" = "table"
  showFilters = true

  constructor() {
    this.filterForm = this.fb.group({
      residentId: [""],
      residenceId: [""],
      contractType: [null],
      status: [null],
      startDateFrom: [null],
      startDateTo: [null],
      endDateFrom: [null],
      endDateTo: [null],
      sortBy: ["createdAt"],
      sortDir: ["desc"],
    })
  }

  ngOnInit(): void {
    this.store
      .select(selectContractFilters)
      .pipe(takeUntil(this.destroy$))
      .subscribe((filters) => {
        this.filterForm.patchValue({
          residentId: filters.residentId || "",
          residenceId: filters.residenceId || "",
          contractType: filters.contractType || null,
          status: filters.status || null,
          startDateFrom: filters.startDateFrom || null,
          startDateTo: filters.startDateTo || null,
          endDateFrom: filters.endDateFrom || null,
          endDateTo: filters.endDateTo || null,
          sortBy: filters.sortBy,
          sortDir: filters.sortDir,
        })

        this.store.dispatch(ContractActions.loadContracts({ filters }))
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  toggleView(): void {
    this.viewMode = this.viewMode === "table" ? "grid" : "table"
  }
  toggleFilters(): void {
    this.showFilters = !this.showFilters
  }
  applyFilters(): void {
    const formValues = this.filterForm.value

    const filters: Partial<ContractFilters> = {
      residentId: formValues.residentId || undefined,
      residenceId: formValues.residenceId || undefined,
      contractType: formValues.contractType || undefined,
      status: formValues.status || undefined,
      startDateFrom: formValues.startDateFrom || undefined,
      startDateTo: formValues.startDateTo || undefined,
      endDateFrom: formValues.endDateFrom || undefined,
      endDateTo: formValues.endDateTo || undefined,
      sortBy: formValues.sortBy,
      sortDir: formValues.sortDir,
      page: 0, 
    }

    this.store.dispatch(ContractActions.setContractFilters({ filters }))
  }

  resetFilters(): void {
    this.store.dispatch(ContractActions.resetContractFilters())
  }
  selectStatus(status: ContractStatus): void {
    this.filterForm.get('status')?.setValue(status);
    this.applyFilters();
  }

  resetStatus(): void {
    this.filterForm.get('status')?.setValue(null);
    this.applyFilters();
  }
  onPageChange(page: number): void {
    this.store.dispatch(
      ContractActions.setContractFilters({
        filters: { page },
      }),
    )
  }

  confirmDelete(contract: Contract): void {
    this.contractToDelete = contract
    this.showDeleteConfirm = true
  }

  deleteContract(): void {
    if (this.contractToDelete) {
      this.store.dispatch(
        ContractActions.deleteContract({
          id: this.contractToDelete.id,
        }),
      )
      this.cancelDelete()
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false
    this.contractToDelete = null
  }

  formatDate(dateString: string): string {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  formatContractType(type: ContractType): string {
    if (!type) return ""
    return type
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  formatStatus(status: ContractStatus): string {
    if (!status) return ""
    return status
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  formatPrice(amount: number): string {
    if (amount === undefined || amount === null) return ""
    return new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD" }).format(amount)
  }
}

