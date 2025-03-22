import { Component, type OnDestroy, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Store } from "@ngrx/store"
import { type Observable, Subject, takeUntil } from "rxjs"
import { PaymentStatus, type Subscription, SubscriptionType } from "../../../models/subscription.model"
import { SubscriptionActions } from "../../../store/subscription/subscription.actions"
import {
  selectSelectedSubscription,
  selectSubscriptionLoading,
} from "../../../store/subscription/subscription.selectors"
import { ConfirmDialogComponent } from "../../ui/confirm-dialog/confirm-dialog.component"
import { LoadingSpinnerComponent } from "../../ui/loading-spinner/loading-spinner.component"
import { AuthService } from "../../../services/auth.service"
import { Role } from "../../../models/user.model"
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
  selector: "app-subscription-detail",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ConfirmDialogComponent, LoadingSpinnerComponent, HeaderComponent],
  templateUrl: "./subscription-detail.component.html",
})
export class SubscriptionDetailComponent implements OnInit, OnDestroy {
  private store = inject(Store)
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private authService = inject(AuthService)
  private fb = inject(FormBuilder)
  private destroy$ = new Subject<void>()

  subscription$: Observable<Subscription | null> = this.store.select(selectSelectedSubscription)
  loading$: Observable<boolean> = this.store.select(selectSubscriptionLoading)

  showDeleteConfirm = false
  showConfirmForm = false
  showRefuseForm = false
  showPaymentForm = false
  subscriptionId: string | null = null
  isManager = false
  isResident = false
  userId: string | null = null

  confirmForm: FormGroup
  refuseForm: FormGroup
  paymentForm: FormGroup

  PaymentStatus = PaymentStatus
  SubscriptionType = SubscriptionType

  constructor() {
    this.confirmForm = this.fb.group({
      adminNote: [""],
    })

    this.refuseForm = this.fb.group({
      adminNote: ["", [Validators.required]],
    })

    this.paymentForm = this.fb.group({
      status: ["", [Validators.required]],
    })
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser()
    this.isManager = currentUser?.role === Role.RESIDENCE_MANAGER || currentUser?.role === Role.SUB_RESIDENCE_MANAGER
    this.isResident = currentUser?.role === Role.RESIDENT
    this.userId = currentUser?.id || null

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get("id")
      if (id) {
        this.subscriptionId = id
        this.store.dispatch(SubscriptionActions.loadSubscription({ id }))
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
    this.store.dispatch(SubscriptionActions.resetSelectedSubscription())
  }

  confirmDelete(): void {
    this.showDeleteConfirm = true
  }

  deleteSubscription(): void {
    if (this.subscriptionId) {
      this.store.dispatch(SubscriptionActions.deleteSubscription({ id: this.subscriptionId }))
      this.cancelDelete()
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false
  }

  toggleConfirmForm(): void {
    this.showConfirmForm = !this.showConfirmForm
    this.showRefuseForm = false
    this.showPaymentForm = false
  }

  toggleRefuseForm(): void {
    this.showRefuseForm = !this.showRefuseForm
    this.showConfirmForm = false
    this.showPaymentForm = false
  }

  togglePaymentForm(): void {
    this.showPaymentForm = !this.showPaymentForm
    this.showConfirmForm = false
    this.showRefuseForm = false
  }

  onConfirm(): void {
    if (this.confirmForm.valid && this.subscriptionId) {
      const adminNote = this.confirmForm.get("adminNote")?.value || ""
      this.store.dispatch(
        SubscriptionActions.confirmSubscription({
          id: this.subscriptionId,
          adminNote: adminNote,
        }),
      )
      this.showConfirmForm = false
      this.confirmForm.reset()
    }
  }

  onRefuse(): void {
    if (this.refuseForm.valid && this.subscriptionId) {
      const adminNote = this.refuseForm.get("adminNote")?.value
      this.store.dispatch(
        SubscriptionActions.refuseSubscription({
          id: this.subscriptionId,
          adminNote: adminNote,
        }),
      )
      this.showRefuseForm = false
      this.refuseForm.reset()
    }
  }

  onUpdatePayment(): void {
    if (this.paymentForm.valid && this.subscriptionId) {
      const status = this.paymentForm.get("status")?.value
      this.store.dispatch(
        SubscriptionActions.updatePaymentStatus({
          id: this.subscriptionId,
          status: status,
        }),
      )
      this.showPaymentForm = false
      this.paymentForm.reset()
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  formatSubscriptionType(type: SubscriptionType): string {
    if (!type) return ""
    return type
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  formatPaymentStatus(status: PaymentStatus): string {
    if (!status) return ""
    return status
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  formatPrice(price: number): string {
    if (!price) return ""
    return new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD" }).format(price)
  }

  getPaymentStatusTextColor(status: PaymentStatus): string {
    switch (status) {
      case PaymentStatus.PENDING:
        return "text-pending"
      case PaymentStatus.PAID:
        return "text-paid"
      case PaymentStatus.FAILED:
        return "text-failed"
      case PaymentStatus.REFUNDED:
        return "text-refunded"
      case PaymentStatus.CANCELLED:
        return "text-cancelled"
      default:
        return ""
    }
  }

  getPaymentStatusDotColor(status: PaymentStatus): string {
    switch (status) {
      case PaymentStatus.PENDING:
        return "bg-amber-500"
      case PaymentStatus.PAID:
        return "bg-green-500"
      case PaymentStatus.FAILED:
        return "bg-red-500"
      case PaymentStatus.REFUNDED:
        return "bg-blue-500"
      case PaymentStatus.CANCELLED:
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }


  canModifySubscription(subscription: Subscription): boolean {
    if (this.isResident) {
      return subscription.user.id === this.userId && !subscription.isConfirmedByAdmin
    }

    if (this.isManager) {
      return true
    }

    return false
  }
}

