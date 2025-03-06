import { Component, type OnDestroy, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { Store } from "@ngrx/store"
import { type Observable, Subject, takeUntil } from "rxjs"
import {
  type Contract,
  ContractStatus,
  type ContractType,
  type PaymentFrequency,
  type PaymentMethod,
} from "../../../models/contract.model"
import { ContractActions } from "../../../store/contract/contract.actions"
import { selectContractLoading, selectSelectedContract } from "../../../store/contract/contract.selectors"
import { ConfirmDialogComponent } from "../../ui/confirm-dialog/confirm-dialog.component"
import { LoadingSpinnerComponent } from "../../ui/loading-spinner/loading-spinner.component"
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
  selector: 'app-contract-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ConfirmDialogComponent,
    LoadingSpinnerComponent,
    HeaderComponent
],
  templateUrl: `./contract-detail.component.html`,
})
export class ContractDetailComponent implements OnInit, OnDestroy {
  private store = inject(Store)
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private destroy$ = new Subject<void>()

  contract$: Observable<Contract | null> = this.store.select(selectSelectedContract)
  loading$: Observable<boolean> = this.store.select(selectContractLoading)

  showDeleteConfirm = false
  contractId: string | null = null

  // Expose enums to template
  ContractStatus = ContractStatus

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get("id")
      if (id) {
        this.contractId = id
        this.store.dispatch(ContractActions.loadContract({ id }))
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
    this.store.dispatch(ContractActions.resetSelectedContract())
  }

  confirmDelete(): void {
    this.showDeleteConfirm = true
  }

  deleteContract(): void {
    if (this.contractId) {
      this.store.dispatch(ContractActions.deleteContract({ id: this.contractId }))
      this.cancelDelete()
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false
  }

  formatDate(dateString: string): string {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  formatDateTime(dateString: string): string {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleString()
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

  formatPaymentFrequency(frequency: PaymentFrequency): string {
    if (!frequency) return ""
    return frequency
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  formatPaymentMethod(method: PaymentMethod): string {
    if (!method) return ""
    return method
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  calculatePaymentPercentage(paid: number, total: number): number {
    if (!total || total === 0) return 0
    return Math.min(100, Math.round((paid / total) * 100))
  }
}

