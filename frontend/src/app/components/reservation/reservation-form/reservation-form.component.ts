import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, Subject, takeUntil } from "rxjs";
import { Reservation, ReservationRequest } from "../../../models/reservation.model";
import { Feature, FeatureType } from "../../../models/feature.model";
import { ReservationActions } from "../../../store/reservation/reservation.actions";
import { selectReservationLoading, selectSelectedReservation } from "../../../store/reservation/reservation.selectors";
import { LoadingSpinnerComponent } from "../../ui/loading-spinner/loading-spinner.component";
import { AuthService } from "../../../services/auth.service";
import { FeatureService } from "../../../services/feature.service";
import { ResidenceService } from "../../../services/residence.service";
import { Role } from "../../../models/user.model";
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
  selector: "app-reservation-form",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LoadingSpinnerComponent, HeaderComponent],
  templateUrl: "./reservation-form.component.html",
  styleUrls: ["./residence-form.component.scss"],
})
export class ReservationFormComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private featureService = inject(FeatureService);
  private residenceService = inject(ResidenceService);
  private destroy$ = new Subject<void>();

  loading$: Observable<boolean> = this.store.select(selectReservationLoading);

  reservationForm: FormGroup;
  isEditMode = false;
  reservationId: string | null = null;
  formErrors: Record<string, string> = {};
  isSubmitting = false;
  
  availableFeatures: Feature[] = [];
  selectedFeature: Feature | null = null;
  userId: string | null = null;
  residenceId: string | null = null;
  minDate: string;

  constructor() {
    this.reservationForm = this.createForm();
    
    const today = new Date();
    this.minDate = this.formatDateForInput(today);
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.userId = currentUser?.id || null;

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get("id");
      if (id && id !== "new") {
        this.isEditMode = true;
        this.reservationId = id;
        this.store.dispatch(ReservationActions.loadReservation({ id }));

        this.store
          .select(selectSelectedReservation)
          .pipe(takeUntil(this.destroy$))
          .subscribe((reservation) => {
            if (reservation) {
              this.patchForm(reservation);
              if (reservation.feature) {
                this.loadFeatureDetails(reservation.feature.id);
              }
            }
          });
      } else {
        this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
          const featureId = params["featureId"];
          if (featureId) {
            this.reservationForm.patchValue({ featureId });
            this.loadFeatureDetails(featureId);
          } else {
            this.loadAvailableFeatures();
          }
        });
      }
    });

    this.reservationForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.validateForm();
    });

    this.reservationForm.get("featureId")?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((featureId) => {
      if (featureId) {
        this.loadFeatureDetails(featureId);
      } else {
        this.selectedFeature = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createForm(): FormGroup {
    return this.fb.group({
      featureId: [null, [Validators.required]],
      requestedDate: [null, [Validators.required]],
    });
  }

  patchForm(reservation: Reservation): void {
    this.reservationForm.patchValue({
      featureId: reservation.feature?.id,
      requestedDate: this.formatDateTimeForInput(new Date(reservation.requestedDate)),
    });
  }

  validateForm(): void {
    this.formErrors = {};
    const form = this.reservationForm;

    if (form.get("featureId")?.invalid && form.get("featureId")?.errors?.["required"]) {
      this.formErrors["featureId"] = "Service is required";
    }

    if (form.get("requestedDate")?.invalid && form.get("requestedDate")?.errors?.["required"]) {
      this.formErrors["requestedDate"] = "Requested date is required";
    }

    if (this.selectedFeature?.requiresManagerApproval) {
      // Additional validation if needed
    }
  }

  loadAvailableFeatures(): void {

    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser) {
      if (currentUser.role === Role.RESIDENCE_MANAGER) {
        this.residenceService.getResidenceByManager(currentUser.id).subscribe((residence) => {
          this.residenceId = residence.id;
          this.loadFeaturesForResidence(residence.id);
        });
      } else if (currentUser.role === Role.SUB_RESIDENCE_MANAGER && currentUser.managerId) {
        this.residenceService.getResidenceByManager(currentUser.managerId).subscribe((residence) => {
          this.residenceId = residence.id;
          this.loadFeaturesForResidence(residence.id);
        });
      } else if (currentUser.role === Role.RESIDENT) {

        this.featureService.getAllFeatures({
          page: 0,
          size: 100,
          sortBy: "name",
          sortDir: "asc",
          featureType: FeatureType.RESERVATION_BASED,
          active: true
        }).subscribe((response) => {
          this.availableFeatures = response.content;
        });
      }
    }
  }

  loadFeaturesForResidence(residenceId: string): void {
    this.residenceService.getResidenceById(residenceId).subscribe((residence) => {
      this.featureService.getAllFeatures({
        page: 0,
        size: 100,
        sortBy: "name",
        sortDir: "asc",
        featureType: FeatureType.RESERVATION_BASED,
        active: true,
        residenceName: residence.name
      }).subscribe((response) => {
        this.availableFeatures = response.content;
        console.log(response.content)
      });
    });
  }

  loadFeatureDetails(featureId: string): void {
    this.featureService.getFeatureById(featureId).subscribe((feature) => {
      this.selectedFeature = feature;
    });
  }

  onSubmit(): void {
    if (this.reservationForm.invalid || !this.userId) {
      this.validateForm();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.reservationForm.value;

    const reservationRequest: ReservationRequest = {
      residentId: this.userId,
      featureId: formValue.featureId,
      requestedDate: new Date(formValue.requestedDate).toISOString(),
    };

    if (this.isEditMode && this.reservationId) {
      this.store.dispatch(
        ReservationActions.updateReservation({
          id: this.reservationId,
          reservation: reservationRequest,
        })
      );
    } else {
      this.store.dispatch(
        ReservationActions.createReservation({
          reservation: reservationRequest,
        })
      );
    }
  }

  formatDateTimeForInput(date: Date): string {
    return this.formatDateForInput(date);
  }

  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  currentStep = 1;
  showTerms = false;
  showCancellation = false;
  setupFormListeners(): void {
    // Listen for changes to the featureId control
    this.reservationForm.get('featureId')?.valueChanges.subscribe(featureId => {
      if (featureId) {
        this.selectedFeature = this.availableFeatures.find(f => f.id === featureId) ?? null;
      } else {
        this.selectedFeature = null;
      }
    });
  }

  selectService(featureId: string): void {
    this.reservationForm.get('featureId')?.setValue(featureId);
  }

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    // Only allow going to a step if previous steps are completed
    if (step === 1 || 
        (step === 2 && this.reservationForm.get('featureId')?.valid) || 
        (step === 3 && this.reservationForm.get('featureId')?.valid && this.reservationForm.get('requestedDate')?.valid)) {
      this.currentStep = step;
    }
  }

  toggleTerms(): void {
    this.showTerms = !this.showTerms;
  }

  toggleCancellation(): void {
    this.showCancellation = !this.showCancellation;
  }

  formatDateTime(dateTime: string): string {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return date.toLocaleString('fr-MA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

}
