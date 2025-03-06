import { Component, type OnDestroy, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { Store } from "@ngrx/store"
import { type Observable, Subject, takeUntil } from "rxjs"
import { type Feature, FeatureCategory, FeatureType } from "../../../models/feature.model"
import { FeatureActions } from "../../../store/feature/feature.actions"
import { selectFeatureLoading, selectSelectedFeature } from "../../../store/feature/feature.selectors"
import { LoadingSpinnerComponent } from "../../ui/loading-spinner/loading-spinner.component"
import { AuthService } from "../../../services/auth.service"
import { Role } from "../../../models/user.model"
import { ResidenceService } from "../../../services/residence.service"
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
  selector: "app-feature-form",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LoadingSpinnerComponent, HeaderComponent],
  templateUrl: "./feature-form.component.html",
})
export class FeatureFormComponent implements OnInit, OnDestroy {
  private store = inject(Store)
  private fb = inject(FormBuilder)
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private authService = inject(AuthService)
  private residenceService = inject(ResidenceService)
  private destroy$ = new Subject<void>()

  loading$: Observable<boolean> = this.store.select(selectFeatureLoading)

  featureForm: FormGroup
  isEditMode = false
  featureId: string | null = null
  formErrors: Record<string, string> = {}
  isSubmitting = false
  selectedImage: File | null = null
  imagePreviewUrl: string | null = null
  residenceId: string | null = null

  FeatureType = FeatureType
  FeatureCategory = FeatureCategory

  constructor() {
    this.featureForm = this.createForm()
  }

  ngOnInit(): void {
    this.loadResidenceId()

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get("id")
      if (id && id !== "new") {
        this.isEditMode = true
        this.featureId = id
        this.store.dispatch(FeatureActions.loadFeature({ id }))

        this.store
          .select(selectSelectedFeature)
          .pipe(takeUntil(this.destroy$))
          .subscribe((feature) => {
            if (feature) {
              this.patchForm(feature)
              if (feature.imageUrl) {
                this.imagePreviewUrl = feature.imageUrl
              }
            }
          })
      }
    })

    this.featureForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.validateForm()
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ["", [Validators.required]],
      description: [""],
      featureType: [FeatureType.SUBSCRIPTION_BASED, [Validators.required]],
      featureCategory: [FeatureCategory.LEISURE, [Validators.required]],
      location: [""],
      active: [true, [Validators.required]],
      termsAndConditions: [""],
      cancellationPolicy: [""],
      requiresManagerApproval: [false],
    })
  }

  patchForm(feature: Feature): void {
    this.featureForm.patchValue({
      name: feature.name,
      description: feature.description,
      featureType: feature.featureType,
      featureCategory: feature.featureCategory,
      location: feature.location,
      active: feature.active,
      termsAndConditions: feature.termsAndConditions,
      cancellationPolicy: feature.cancellationPolicy,
      requiresManagerApproval: feature.requiresManagerApproval,
    })

    this.residenceId = feature.residenceId
  }

  validateForm(): void {
    this.formErrors = {}
    const form = this.featureForm

    if (form.get("name")?.invalid && form.get("name")?.errors?.["required"]) {
      this.formErrors["name"] = "Name is required"
    }

    if (form.get("featureType")?.invalid && form.get("featureType")?.errors?.["required"]) {
      this.formErrors["featureType"] = "Feature type is required"
    }

    if (form.get("featureCategory")?.invalid && form.get("featureCategory")?.errors?.["required"]) {
      this.formErrors["featureCategory"] = "Feature category is required"
    }

    if (form.get("active")?.invalid && form.get("active")?.errors?.["required"]) {
      this.formErrors["active"] = "Active status is required"
    }
  }

  loadResidenceId(): void {
    const currentUser = this.authService.getCurrentUser()
    if (currentUser) {
      if (currentUser.role === Role.RESIDENCE_MANAGER) {
        this.residenceService.getResidenceByManager(currentUser.id).subscribe((residence) => {
          this.residenceId = residence.id
        })
      } else if (currentUser.role === Role.SUB_RESIDENCE_MANAGER && currentUser.managerId) {
        this.residenceService.getResidenceByManager(currentUser.managerId).subscribe((residence) => {
          this.residenceId = residence.id
        })
      }
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0]
      this.createImagePreview()
    }
  }

  createImagePreview(): void {
    if (this.selectedImage) {
      const reader = new FileReader()
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string
      }
      reader.readAsDataURL(this.selectedImage)
    }
  }

  removeImage(): void {
    this.selectedImage = null
    this.imagePreviewUrl = null
  }

  onSubmit(): void {
    if (this.featureForm.invalid || !this.residenceId) {
      this.validateForm()
      return
    }

    this.isSubmitting = true
    const formValue = this.featureForm.value

    const featureRequest = {
      ...formValue,
      residenceId: this.residenceId,
    }

    if (this.isEditMode && this.featureId) {
      this.store.dispatch(
        FeatureActions.updateFeature({
          id: this.featureId,
          featureUpload: {
            feature: featureRequest,
            image: this.selectedImage || undefined,
          },
        }),
      )
    } else {
      this.store.dispatch(
        FeatureActions.createFeature({
          featureUpload: {
            feature: featureRequest,
            image: this.selectedImage || undefined,
          },
        }),
      )
    }
  }

  formatCategoryName(category: FeatureCategory): string {
    return category
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }
}

