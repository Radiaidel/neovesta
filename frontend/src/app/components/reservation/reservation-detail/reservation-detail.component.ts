import { Component, type OnDestroy, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Store } from "@ngrx/store"
import { type Observable, Subject, takeUntil } from "rxjs"
import { type Reservation, ReservationStatus } from "../../../models/reservation.model"
import { ReservationActions } from "../../../store/reservation/reservation.actions"
import { selectReservationLoading, selectSelectedReservation } from "../../../store/reservation/reservation.selectors"
import { ConfirmDialogComponent } from "../../ui/confirm-dialog/confirm-dialog.component"
import { LoadingSpinnerComponent } from "../../ui/loading-spinner/loading-spinner.component"
import { AuthService } from "../../../services/auth.service"
import { Role } from "../../../models/user.model"
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
  selector: "app-reservation-detail",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ConfirmDialogComponent, LoadingSpinnerComponent, HeaderComponent],
  templateUrl: "./reservation-detail.component.html",
  styleUrl: "./reservation-detail.component.css"
})
export class ReservationDetailComponent implements OnInit, OnDestroy {
  private store = inject(Store)
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private authService = inject(AuthService)
  private fb = inject(FormBuilder)
  private destroy$ = new Subject<void>()

  reservation$: Observable<Reservation | null> = this.store.select(selectSelectedReservation)
  loading$: Observable<boolean> = this.store.select(selectReservationLoading)

  showDeleteConfirm = false
  showConfirmForm = false
  showRejectForm = false
  reservationId: string | null = null
  isManager = false
  isResident = false
  userId: string | null = null

  confirmForm: FormGroup
  rejectForm: FormGroup

  ReservationStatus = ReservationStatus

  constructor() {
    this.confirmForm = this.fb.group({
      scheduledDate: [null, [Validators.required]],
    })

    this.rejectForm = this.fb.group({
      adminNote: ["", [Validators.required]],
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
        this.reservationId = id
        this.store.dispatch(ReservationActions.loadReservation({ id }))
      }
    })

    this.reservation$.pipe(takeUntil(this.destroy$)).subscribe((reservation) => {
      if (reservation) {
        const requestedDate = new Date(reservation.requestedDate)
        this.confirmForm.patchValue({
          scheduledDate: this.formatDateForInput(requestedDate),
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
    this.store.dispatch(ReservationActions.resetSelectedReservation())
  }

  confirmDelete(): void {
    this.showDeleteConfirm = true
  }

  deleteReservation(): void {
    if (this.reservationId) {
      this.store.dispatch(ReservationActions.deleteReservation({ id: this.reservationId }))
      this.cancelDelete()
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false
  }

  toggleConfirmForm(): void {
    this.showConfirmForm = !this.showConfirmForm
    this.showRejectForm = false
  }

  toggleRejectForm(): void {
    this.showRejectForm = !this.showRejectForm
    this.showConfirmForm = false
  }

  onConfirm(): void {
    if (this.confirmForm.valid && this.reservationId) {
      const scheduledDate = this.confirmForm.get("scheduledDate")?.value
      this.store.dispatch(
        ReservationActions.confirmReservation({
          id: this.reservationId,
          scheduledDate: scheduledDate,
        }),
      )
      this.showConfirmForm = false
    }
  }

  onReject(): void {
    if (this.rejectForm.valid && this.reservationId) {
      const adminNote = this.rejectForm.get("adminNote")?.value
      this.store.dispatch(
        ReservationActions.rejectReservation({
          id: this.reservationId,
          adminNote: adminNote,
        }),
      )
      this.showRejectForm = false
    }
  }

  onCancel(): void {
    if (this.reservationId) {
      this.store.dispatch(
        ReservationActions.cancelReservation({
          id: this.reservationId,
        }),
      )
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  formatDateForInput(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  formatStatus(status: ReservationStatus): string {
    if (!status) return ""
    return status
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  // getStatusColor(status: ReservationStatus): string {
  //   switch (status) {
  //     case ReservationStatus.PENDING:
  //       return "bg-yellow-100 text-yellow-800"
  //     case ReservationStatus.CONFIRMED:
  //       return "bg-green-100 text-green-800"
  //     case ReservationStatus.REJECTED:
  //       return "bg-red-100 text-red-800"
  //     case ReservationStatus.CANCELLED:
  //       return "bg-gray-100 text-gray-800"
  //     case ReservationStatus.COMPLETED:
  //       return "bg-blue-100 text-blue-800"
  //     default:
  //       return "bg-gray-100 text-gray-800"
  //   }
  // }

  canModifyReservation(reservation: Reservation): boolean {
    if (this.isResident) {
      return reservation.resident?.id === this.userId && reservation.status === ReservationStatus.PENDING
    }

    if (this.isManager) {
      return reservation.status === ReservationStatus.PENDING
    }

    return false
  }

  formatPrice(price: number): string {
    if (!price) return ""
    return new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD" }).format(price)
  }

  getStatusColor(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.PENDING:
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 "
      case ReservationStatus.CONFIRMED:
        return "bg-green-100 text-green-900 "
      case ReservationStatus.REJECTED:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 "
      case ReservationStatus.CANCELLED:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 "
      case ReservationStatus.COMPLETED:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 "
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 "
    }
  }
  getStatusDate(reservation: any): string {
    // This is a placeholder - in a real app, you would have a timestamp for status changes
    return "Recently"
  }
  showTerms = false
  showCancellation = false
  toggleTerms(): void {
    this.showTerms = !this.showTerms
  }

  toggleCancellation(): void {
    this.showCancellation = !this.showCancellation
  }
  getStatusDotColor(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.PENDING:
        return "bg-amber-500 dark:bg-amber-400"
      case ReservationStatus.CONFIRMED:
        return "bg-green-500 dark:bg-green-400"
      case ReservationStatus.REJECTED:
        return "bg-red-500 dark:bg-red-400"
      case ReservationStatus.CANCELLED:
        return "bg-gray-500 dark:bg-gray-400"
      case ReservationStatus.COMPLETED:
        return "bg-blue-500 dark:bg-blue-400"
      default:
        return "bg-gray-500 dark:bg-gray-400"
    }
  }

  getStatusBgColor(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.PENDING:
        return "bg-amber-50 dark:bg-amber-900/10"
      case ReservationStatus.CONFIRMED:
        return "bg-green-100 "
      case ReservationStatus.REJECTED:
        return "bg-red-50 dark:bg-red-900/10"
      case ReservationStatus.CANCELLED:
        return "bg-gray-50 dark:bg-gray-800"
      case ReservationStatus.COMPLETED:
        return "bg-blue-50 dark:bg-blue-900/10"
      default:
        return "bg-gray-50 dark:bg-gray-800"
    }
  }

  getStatusTextColor(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.PENDING:
        return "text-amber-700 "
      case ReservationStatus.CONFIRMED:
        return "text-green-900 "
      case ReservationStatus.REJECTED:
        return "text-red-700 "
      case ReservationStatus.CANCELLED:
        return "text-gray-700 "
      case ReservationStatus.COMPLETED:
        return "text-blue-700 "
      default:
        return "text-gray-700 "
    }
  }

  getStatusIconColor(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.PENDING:
        return "text-amber-500 dark:text-amber-400"
      case ReservationStatus.CONFIRMED:
        return "text-green-500 dark:text-green-400"
      case ReservationStatus.REJECTED:
        return "text-red-500 dark:text-red-400"
      case ReservationStatus.CANCELLED:
        return "text-gray-500 dark:text-gray-400"
      case ReservationStatus.COMPLETED:
        return "text-blue-500 dark:text-blue-400"
      default:
        return "text-gray-500 dark:text-gray-400"
    }
  }

  getStatusIcon(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.PENDING:
        return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />'
      case ReservationStatus.CONFIRMED:
        return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />'
      case ReservationStatus.REJECTED:
        return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />'
      case ReservationStatus.CANCELLED:
        return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />'
      case ReservationStatus.COMPLETED:
        return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />'
      default:
        return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />'
    }
  }

  getTimelineStatusClass(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.CONFIRMED:
        return "bg-green-100 dark:bg-green-900/30 border-2 border-green-500 dark:border-green-600"
      case ReservationStatus.REJECTED:
        return "bg-red-100 dark:bg-red-900/30 border-2 border-red-500 dark:border-red-600"
      case ReservationStatus.CANCELLED:
        return "bg-gray-100 dark:bg-gray-700 border-2 border-gray-500 dark:border-gray-600"
      case ReservationStatus.COMPLETED:
        return "bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 dark:border-blue-600"
      default:
        return "bg-gray-100 dark:bg-gray-700 border-2 border-gray-500 dark:border-gray-600"
    }
  }

  getTimelineDotClass(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.CONFIRMED:
        return "bg-green-500 dark:bg-green-600"
      case ReservationStatus.REJECTED:
        return "bg-red-500 dark:bg-red-600"
      case ReservationStatus.CANCELLED:
        return "bg-gray-500 dark:bg-gray-600"
      case ReservationStatus.COMPLETED:
        return "bg-blue-500 dark:bg-blue-600"
      default:
        return "bg-gray-500 dark:bg-gray-600"
    }
  }
}

