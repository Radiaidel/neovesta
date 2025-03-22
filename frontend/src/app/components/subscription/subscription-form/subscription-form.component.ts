import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, Subject, combineLatest, takeUntil } from "rxjs";
import { map } from "rxjs/operators";

import { PaymentStatus, Subscription, SubscriptionType } from "../../../models/subscription.model";
import { SubscriptionActions } from "../../../store/subscription/subscription.actions";
import { selectAllFeatures, selectFeatureLoading } from "../../../store/feature/feature.selectors";
import {
  selectSelectedSubscription,
  selectSubscriptionLoading,
} from "../../../store/subscription/subscription.selectors";
import { LoadingSpinnerComponent } from "../../ui/loading-spinner/loading-spinner.component";
import { AuthService } from "../../../services/auth.service";
import { Role } from "../../../models/user.model";
import { selectUsers, selectLoading as selectUsersLoading } from "../../../store/user.selectors";
import * as UserActions from "../../../store/user.actions";
import * as FeatureActions from "../../../store/feature/feature.actions";
import { Feature } from "../../../models/feature.model";
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
  selector: "app-subscription-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoadingSpinnerComponent, HeaderComponent],
  templateUrl: "./subscription-form.component.html",
})
export class SubscriptionFormComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();

  subscriptionForm: FormGroup;
  isEditMode = false;
  subscriptionId: string | null = null;
  isManager = false;
  currentUserId: string | null = null;

  subscription$: Observable<Subscription | null> = this.store.select(selectSelectedSubscription);
  features$: Observable<Feature[]> = this.store
    .select(selectAllFeatures)
    .pipe(map((pageResponse) => (pageResponse?.content || []) as Feature[]));
  users$: Observable<any[]> = this.store.select(selectUsers).pipe(
    map((pageResponse) => (pageResponse?.content || []) as any[])
  );

  loading$: Observable<boolean> = combineLatest([
    this.store.select(selectSubscriptionLoading),
    this.store.select(selectFeatureLoading),
    this.store.select(selectUsersLoading),
  ]).pipe(
    map(
      ([subscriptionLoading, featuresLoading, usersLoading]) => subscriptionLoading || featuresLoading || usersLoading
    )
  );

  SubscriptionType = SubscriptionType;
  PaymentStatus = PaymentStatus;

  constructor() {
    this.subscriptionForm = this.fb.group({
      userId: ["", Validators.required],
      featureId: ["", Validators.required],
      type: [SubscriptionType.MONTHLY, Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      isActive: [true],
      isConfirmedByAdmin: [false],
      adminNote: [""],
      paymentStatus: [PaymentStatus.PENDING],
    });
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.isManager = currentUser?.role === Role.RESIDENCE_MANAGER || currentUser?.role === Role.SUB_RESIDENCE_MANAGER;
    this.currentUserId = currentUser?.id || null;

    if (!this.isManager && this.currentUserId) {
      this.subscriptionForm.get("userId")?.setValue(this.currentUserId);
      this.subscriptionForm.get("userId")?.disable();
    }
    

    this.store.dispatch(FeatureActions.loadFeatures({ filters: {
        page: 0, size: 100,
        sortBy: "",
        sortDir: "asc"
    } }));

    // if (this.isManager) {
    //   this.store.dispatch(UserActions.loadUsers({ request: {} }));
    // }

    // In ngOnInit() where you dispatch loadUsers
if (this.isManager) {
  this.store.dispatch(UserActions.loadUsers({ 
    request: { 
      page: 0,      // Add default page
      size: 10,     // Add default size
      searchTerm: "",
      role: undefined,
      residenceId: undefined
    } 
  }));
}

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get("id");
      if (id) {
        this.isEditMode = true;
        this.subscriptionId = id;
        this.store.dispatch(SubscriptionActions.loadSubscription({ id }));

        this.subscription$.pipe(takeUntil(this.destroy$)).subscribe((subscription) => {
          if (subscription) {
            this.updateForm(subscription);
          }
        });
      } else {
        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);

        this.subscriptionForm.patchValue({
          startDate: this.formatDateForInput(today),
          endDate: this.formatDateForInput(nextMonth),
        });
      }
    });

    this.subscriptionForm
      .get("type")
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((type) => {
        this.updateEndDate(type);
      });

    this.subscriptionForm
      .get("featureId")
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((featureId) => {
        if (featureId) {
          this.features$.pipe(takeUntil(this.destroy$)).subscribe((features) => {
            const feature = features.find((f) => f.id === featureId);
            if (feature && feature.pricePerMonth) {
              this.subscriptionForm.get("price")?.setValue(feature.pricePerMonth);
            }
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(SubscriptionActions.resetSelectedSubscription());
  }

  updateForm(subscription: Subscription): void {
    this.subscriptionForm.patchValue({
      userId: subscription.user.id,
      featureId: subscription.feature.id,
      type: subscription.type,
      startDate: this.formatDateForInput(new Date(subscription.startDate)),
      endDate: this.formatDateForInput(new Date(subscription.endDate)),
      price: subscription.price,
      isActive: subscription.isActive,
      isConfirmedByAdmin: subscription.isConfirmedByAdmin,
      adminNote: subscription.adminNote || "",
      paymentStatus: subscription.paymentStatus,
    });

    if (subscription.isConfirmedByAdmin && !this.isManager) {
      this.subscriptionForm.disable();
    }
  }

  formatDateForInput(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  updateEndDate(type: SubscriptionType): void {
    const startDateValue = this.subscriptionForm.get("startDate")?.value;
    if (!startDateValue) return;

    const startDate = new Date(startDateValue);
    const endDate = new Date(startDate);

    switch (type) {
      case SubscriptionType.MONTHLY:
        endDate.setMonth(startDate.getMonth() + 1);
        break;
  
      case SubscriptionType.YEARLY:
        endDate.setFullYear(startDate.getFullYear() + 1);
        break;
    }

    this.subscriptionForm.get("endDate")?.setValue(this.formatDateForInput(endDate));
  }

  onSubmit(): void {
    if (this.subscriptionForm.invalid) {
      Object.keys(this.subscriptionForm.controls).forEach((key) => {
        const control = this.subscriptionForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const formValue = this.isManager
      ? this.subscriptionForm.value
      : { ...this.subscriptionForm.value, userId: this.currentUserId };

    if (this.isEditMode && this.subscriptionId) {
      this.store.dispatch(
        SubscriptionActions.updateSubscription({
          id: this.subscriptionId,
          subscription: formValue,
        })
      );
    } else {
      this.store.dispatch(
        SubscriptionActions.createSubscription({
          subscription: formValue,
        })
      );
    }
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

  cancel(): void {
    if (this.isEditMode && this.subscriptionId) {
      this.router.navigate(["/subscriptions", this.subscriptionId]);
    } else {
      this.router.navigate(["/subscriptions"]);
    }
  }
}
