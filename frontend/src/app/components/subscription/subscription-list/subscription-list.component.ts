import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Observable, Subject, takeUntil } from "rxjs";
import { PageResponse } from "../../../models/common.model";
import { PaymentStatus, Subscription, SubscriptionFilters, SubscriptionType } from "../../../models/subscription.model";
import { SubscriptionActions } from "../../../store/subscription/subscription.actions";
import {
  selectAllSubscriptions,
  selectSubscriptionCurrentPage,
  selectSubscriptionFilters,
  selectSubscriptionIsFirstPage,
  selectSubscriptionIsLastPage,
  selectSubscriptionLoading,
  selectSubscriptionTotalPages,
} from "../../../store/subscription/subscription.selectors";
import { ConfirmDialogComponent } from "../../ui/confirm-dialog/confirm-dialog.component";
import { LoadingSpinnerComponent } from "../../ui/loading-spinner/loading-spinner.component";
import { PaginationComponent } from "../../ui/pagination/pagination.component";
import { AuthService } from "../../../services/auth.service";
import { Role } from "../../../models/user.model";
import { SubscriptionCardComponent } from "../subscription-card/subscription-card.component";
import { ResidenceService } from "../../../services/residence.service";
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
  selector: "app-subscription-list",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ConfirmDialogComponent,
    LoadingSpinnerComponent,
    PaginationComponent,
    SubscriptionCardComponent,
    HeaderComponent
],
  templateUrl: "./subscription-list.component.html",
  styleUrls: ["./subscription-list.component.css"]
})
export class SubscriptionListComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private residenceService = inject(ResidenceService);
  private destroy$ = new Subject<void>();


  subscriptions$: Observable<PageResponse<Subscription> | null> = this.store.select(selectAllSubscriptions);
  loading$: Observable<boolean> = this.store.select(selectSubscriptionLoading);
  currentPage$: Observable<number> = this.store.select(selectSubscriptionCurrentPage);
  totalPages$: Observable<number> = this.store.select(selectSubscriptionTotalPages);
  isFirstPage$: Observable<boolean> = this.store.select(selectSubscriptionIsFirstPage);
  isLastPage$: Observable<boolean> = this.store.select(selectSubscriptionIsLastPage);

  filterForm: FormGroup;
  showDeleteConfirm = false;
  subscriptionToDelete: Subscription | null = null;
  isManager = false;
  isResident = false;
  userId: string | null = null;
  residenceId: string | null = null;
  residenceName = "";
  showFilters = true

  SubscriptionType = SubscriptionType;
  PaymentStatus = PaymentStatus;

  constructor() {
    this.filterForm = this.fb.group({
      search: [""],
      type: [null],
      paymentStatus: [null],
      isActive: [null],
      isConfirmedByAdmin: [null],
      startDateFrom: [null],
      startDateTo: [null],
      endDateFrom: [null],
      endDateTo: [null],
      sortBy: ["startDate"],
      sortDir: ["desc"],
    });
  }

  ngOnInit(): void {    const currentUser = this.authService.getCurrentUser();
    this.isManager = currentUser?.role === Role.RESIDENCE_MANAGER || currentUser?.role === Role.SUB_RESIDENCE_MANAGER;
    this.isResident = currentUser?.role === Role.RESIDENT;
    this.userId = currentUser?.id || null;

    if (this.isManager) {      this.loadManagerResidence(currentUser);
    } else if (this.isResident) {      this.loadResidentSubscriptions();
    } else {      this.loadAllSubscriptions();
    }
  }

  loadManagerResidence(currentUser: any): void {
    if (currentUser?.role === Role.RESIDENCE_MANAGER) {
      this.residenceService.getResidenceByManager(currentUser.id).subscribe((residence) => {
        this.residenceId = residence.id;
        this.residenceName = residence.name;
        this.loadSubscriptionsForResidence();
      });
    } else if (currentUser?.role === Role.SUB_RESIDENCE_MANAGER && currentUser.managerId) {
      this.residenceService.getResidenceByManager(currentUser.managerId).subscribe((residence) => {
        this.residenceId = residence.id;
        this.residenceName = residence.name;
        this.loadSubscriptionsForResidence();
      });
    }
  }

  loadSubscriptionsForResidence(): void {
    this.store
      .select(selectSubscriptionFilters)
      .pipe(takeUntil(this.destroy$))
      .subscribe((filters) => {
        this.updateFormFromFilters(filters);

        const updatedFilters: SubscriptionFilters = {
          ...filters,
          residenceId: this.residenceId || undefined,
        };

        this.store.dispatch(SubscriptionActions.loadSubscriptions({ filters: updatedFilters }));
      });
  }

  loadResidentSubscriptions(): void {
    this.store
      .select(selectSubscriptionFilters)
      .pipe(takeUntil(this.destroy$))
      .subscribe((filters) => {
        this.updateFormFromFilters(filters);

        const updatedFilters: SubscriptionFilters = {
          ...filters,
          userId: this.userId || undefined,
        };

        this.store.dispatch(SubscriptionActions.loadSubscriptions({ filters: updatedFilters }));
      });
  }

  loadAllSubscriptions(): void {
    this.store
      .select(selectSubscriptionFilters)
      .pipe(takeUntil(this.destroy$))
      .subscribe((filters) => {
        this.updateFormFromFilters(filters);

        this.store.dispatch(SubscriptionActions.loadSubscriptions({ filters }));
      });
  }

  updateFormFromFilters(filters: SubscriptionFilters): void {
    this.filterForm.patchValue({
      search: filters.search || "",
      type: filters.type || null,
      paymentStatus: filters.paymentStatus || null,
      isActive: filters.isActive === undefined ? null : filters.isActive,
      isConfirmedByAdmin: filters.isConfirmedByAdmin === undefined ? null : filters.isConfirmedByAdmin,
      startDateFrom: filters.startDateFrom || null,
      startDateTo: filters.startDateTo || null,
      endDateFrom: filters.endDateFrom || null,
      endDateTo: filters.endDateTo || null,
      sortBy: filters.sortBy,
      sortDir: filters.sortDir,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilters(): void {
    const formValues = this.filterForm.value;

    const filters: Partial<SubscriptionFilters> = {
      search: formValues.search || undefined,
      type: formValues.type || undefined,
      paymentStatus: formValues.paymentStatus || undefined,
      isActive: formValues.isActive === null ? undefined : formValues.isActive,
      isConfirmedByAdmin: formValues.isConfirmedByAdmin === null ? undefined : formValues.isConfirmedByAdmin,
      startDateFrom: formValues.startDateFrom || undefined,
      startDateTo: formValues.startDateTo || undefined,
      endDateFrom: formValues.endDateFrom || undefined,
      endDateTo: formValues.endDateTo || undefined,
      sortBy: formValues.sortBy,
      sortDir: formValues.sortDir,
      page: 0, 
    };

   
    if (this.isResident && this.userId) {
      filters.userId = this.userId;
    } else if (this.isManager && this.residenceId) {
      filters.residenceId = this.residenceId;
    }

    this.store.dispatch(SubscriptionActions.setSubscriptionFilters({ filters }));
  }

  resetFilters(): void {
    this.store.dispatch(SubscriptionActions.resetSubscriptionFilters());

    if (this.isResident && this.userId) {
      this.store.dispatch(
        SubscriptionActions.setSubscriptionFilters({
          filters: { userId: this.userId },
        })
      );
    } else if (this.isManager && this.residenceId) {
      this.store.dispatch(
        SubscriptionActions.setSubscriptionFilters({
          filters: { residenceId: this.residenceId },
        })
      );
    }
  }

  onPageChange(page: number): void {
    this.store.dispatch(
      SubscriptionActions.setSubscriptionFilters({
        filters: { page },
      })
    );
  }

  confirmDelete(subscription: Subscription): void {
    this.subscriptionToDelete = subscription;
    this.showDeleteConfirm = true;
  }

  deleteSubscription(): void {
    if (this.subscriptionToDelete) {
      this.store.dispatch(
        SubscriptionActions.deleteSubscription({
          id: this.subscriptionToDelete.id,
        })
      );
      this.cancelDelete();
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.subscriptionToDelete = null;
  }

  confirmSubscription(data: { id: string; adminNote: string }): void {
    this.store.dispatch(
      SubscriptionActions.confirmSubscription({
        id: data.id,
        adminNote: data.adminNote,
      })
    );
  }

  refuseSubscription(data: { id: string; adminNote: string }): void {
    this.store.dispatch(
      SubscriptionActions.refuseSubscription({
        id: data.id,
        adminNote: data.adminNote,
      })
    );
  }

  updatePaymentStatus(data: { id: string; status: string }): void {
    this.store.dispatch(
      SubscriptionActions.updatePaymentStatus({
        id: data.id,
        status: data.status,
      })
    );
  }

  formatDate(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  formatSubscriptionType(type: SubscriptionType): string {
    if (!type) return "";
    return type
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  formatPaymentStatus(status: PaymentStatus): string {
    if (!status) return "";
    return status
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }
  toggleFilters(): void {
    this.showFilters = !this.showFilters
  }

}
