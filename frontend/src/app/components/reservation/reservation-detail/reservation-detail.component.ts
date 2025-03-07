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

  // Expose enums to template
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
    // Check user role
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

    // Subscribe to reservation changes to set default scheduled date
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

  getStatusColor(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.PENDING:
        return "bg-yellow-100 text-yellow-800"
      case ReservationStatus.CONFIRMED:
        return "bg-green-100 text-green-800"
      case ReservationStatus.REJECTED:
        return "bg-red-100 text-red-800"
      case ReservationStatus.CANCELLED:
        return "bg-gray-100 text-gray-800"
      case ReservationStatus.COMPLETED:
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  canModifyReservation(reservation: Reservation): boolean {
    // Residents can only modify their own pending reservations
    if (this.isResident) {
      return reservation.resident?.id === this.userId && reservation.status === ReservationStatus.PENDING
    }

    // Managers can modify any pending reservation
    if (this.isManager) {
      return reservation.status === ReservationStatus.PENDING
    }

    return false
  }
}

