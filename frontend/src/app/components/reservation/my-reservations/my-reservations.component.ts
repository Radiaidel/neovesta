import { Component, type OnDestroy, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormBuilder, type FormGroup, ReactiveFormsModule } from "@angular/forms"
import { Store } from "@ngrx/store"
import { type Observable, Subject, takeUntil } from "rxjs"
import {
  type PageResponse,
  type Reservation,
  type ReservationFilters,
  ReservationStatus,
} from "../../../models/reservation.model"
import { ReservationActions } from "../../../store/reservation/reservation.actions"
import {
  selectAllReservations,
  selectReservationCurrentPage,
  selectReservationFilters,
  selectReservationIsFirstPage,
  selectReservationIsLastPage,
  selectReservationLoading,
  selectReservationTotalPages,
} from "../../../store/reservation/reservation.selectors"
import { ConfirmDialogComponent } from "../../ui/confirm-dialog/confirm-dialog.component"
import { LoadingSpinnerComponent } from "../../ui/loading-spinner/loading-spinner.component"
import { PaginationComponent } from "../../ui/pagination/pagination.component"
import { AuthService } from "../../../services/auth.service"
import { ReservationCardComponent } from "../reservation-card/reservation-card.component"
import { HeaderComponent } from "../../shared/header/header.component";
import { trigger, transition, style, animate, query, stagger } from "@angular/animations"
@Component({
  selector: "app-my-reservations",
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
  templateUrl: "./my-reservations.component.html",
  animations: [
    trigger("cardAnimation", [
      transition("* => *", [
        query(
          ":enter",
          [
            style({ opacity: 0, transform: "translateY(15px)" }),
            stagger(100, [animate("0.3s ease-out", style({ opacity: 1, transform: "translateY(0)" }))]),
          ],
          { optional: true },
        ),
      ]),
    ]),
  ],
})
export class MyReservationsComponent implements OnInit, OnDestroy {
  private store = inject(Store)
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private destroy$ = new Subject<void>()

  reservations$: Observable<PageResponse<Reservation> | null> = this.store.select(selectAllReservations)
  loading$: Observable<boolean> = this.store.select(selectReservationLoading)
  currentPage$: Observable<number> = this.store.select(selectReservationCurrentPage)
  totalPages$: Observable<number> = this.store.select(selectReservationTotalPages)
  isFirstPage$: Observable<boolean> = this.store.select(selectReservationIsFirstPage)
  isLastPage$: Observable<boolean> = this.store.select(selectReservationIsLastPage)

  filterForm: FormGroup
  showDeleteConfirm = false
  reservationToDelete: Reservation | null = null
  userId: string | null = null
  showFilters = true

  // Expose enums to template
  ReservationStatus = ReservationStatus

  constructor() {
    this.filterForm = this.fb.group({
      status: [null],
      dateFilter: ["upcoming"],
      sortBy: ["requestedDate"],
      sortDir: ["desc"],
    })
  }

  ngOnInit(): void {
    // Get current user ID
    const currentUser = this.authService.getCurrentUser()
    this.userId = currentUser?.id || null

    if (!this.userId) {
      // Redirect to login if not logged in
      // For now, we'll just show an empty list
      return
    }

    // Subscribe to filter changes
    this.store
      .select(selectReservationFilters)
      .pipe(takeUntil(this.destroy$))
      .subscribe((filters) => {
        this.filterForm.patchValue({
          status: filters.status || null,
          dateFilter: filters.dateFilter || "upcoming",
          sortBy: filters.sortBy,
          sortDir: filters.sortDir,
        })

        // Set resident ID filter to current user
        const updatedFilters: ReservationFilters = {
          ...filters,
          residentId: this.userId || undefined,
        }

        // Load reservations with current filters
        this.store.dispatch(ReservationActions.loadReservations({ filters: updatedFilters }))
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  applyFilters(): void {
    const formValues = this.filterForm.value

    const filters: Partial<ReservationFilters> = {
      residentId: this.userId || undefined, // Always filter by current user
      status: formValues.status || undefined,
      dateFilter: formValues.dateFilter || undefined,
      sortBy: formValues.sortBy,
      sortDir: formValues.sortDir,
      page: 0, // Reset to first page when applying new filters
    }

    this.store.dispatch(ReservationActions.setReservationFilters({ filters }))
  }

  resetFilters(): void {
    this.store.dispatch(ReservationActions.resetReservationFilters())

    // Set resident ID filter to current user
    if (this.userId) {
      this.store.dispatch(
        ReservationActions.setReservationFilters({
          filters: { residentId: this.userId },
        }),
      )
    }
  }

  onPageChange(page: number): void {
    this.store.dispatch(
      ReservationActions.setReservationFilters({
        filters: { page },
      }),
    )
  }

  confirmDelete(reservation: Reservation): void {
    this.reservationToDelete = reservation
    this.showDeleteConfirm = true
  }

  deleteReservation(): void {
    if (this.reservationToDelete) {
      this.store.dispatch(
        ReservationActions.deleteReservation({
          id: this.reservationToDelete.id,
        }),
      )
      this.cancelDelete()
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false
    this.reservationToDelete = null
  }

  cancelReservation(id: string): void {
    this.store.dispatch(
      ReservationActions.cancelReservation({
        id,
      }),
    )
  }
  toggleFilters(): void {
    this.showFilters = !this.showFilters
  }
  isPending(reservation: any): boolean {
    return reservation.status === ReservationStatus.PENDING
  }

  formatStatus(status: ReservationStatus): string {
    return status ? status.charAt(0) + status.slice(1).toLowerCase() : ""
  }

  formatDate(date: string): string {
    if (!date) return ""
    return new Date(date).toLocaleString("fr-MA", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  getStatusClass(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.PENDING:
        return "status-pending"
      case ReservationStatus.CONFIRMED:
        return "status-confirmed"
      case ReservationStatus.REJECTED:
        return "status-rejected"
      case ReservationStatus.CANCELLED:
        return "status-cancelled"
      case ReservationStatus.COMPLETED:
        return "status-completed"
      default:
        return ""
    }
  }
}

