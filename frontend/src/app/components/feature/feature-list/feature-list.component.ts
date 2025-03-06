import { Component, type OnDestroy, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormBuilder, type FormGroup, ReactiveFormsModule } from "@angular/forms"
import { Store } from "@ngrx/store"
import { type Observable, Subject, takeUntil } from "rxjs"
import { type Feature, FeatureCategory, type FeatureFilters, FeatureType } from "../../../models/feature.model"
import type { PageResponse } from "../../../models/common.model"
import { FeatureActions } from "../../../store/feature/feature.actions"
import {
  selectAllFeatures,
  selectFeatureCurrentPage,
  selectFeatureFilters,
  selectFeatureIsFirstPage,
  selectFeatureIsLastPage,
  selectFeatureLoading,
  selectFeatureTotalPages,
} from "../../../store/feature/feature.selectors"
import { ConfirmDialogComponent } from "../../ui/confirm-dialog/confirm-dialog.component"
import { LoadingSpinnerComponent } from "../../ui/loading-spinner/loading-spinner.component"
import { PaginationComponent } from "../../ui/pagination/pagination.component"
import { AuthService } from "../../../services/auth.service"
import { Role } from "../../../models/user.model"
import { FeatureCardComponent } from "../feature-card/feature-card.component"
import { HeaderComponent } from "../../shared/header/header.component"
import { UserService } from "../../../services/user.service"
import { ResidenceService } from "../../../services/residence.service"

@Component({
  selector: "app-feature-list",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ConfirmDialogComponent,
    LoadingSpinnerComponent,
    PaginationComponent,
    FeatureCardComponent,
    HeaderComponent,
  ],
  templateUrl: "./feature-list.component.html",
})
export class FeatureListComponent implements OnInit, OnDestroy {
  private store = inject(Store)
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private userService = inject(UserService)
  private residenceService = inject(ResidenceService)
  private destroy$ = new Subject<void>()

  features$: Observable<PageResponse<Feature> | null> = this.store.select(selectAllFeatures)
  loading$: Observable<boolean> = this.store.select(selectFeatureLoading)
  currentPage$: Observable<number> = this.store.select(selectFeatureCurrentPage)
  totalPages$: Observable<number> = this.store.select(selectFeatureTotalPages)
  isFirstPage$: Observable<boolean> = this.store.select(selectFeatureIsFirstPage)
  isLastPage$: Observable<boolean> = this.store.select(selectFeatureIsLastPage)

  filterForm: FormGroup
  showDeleteConfirm = false
  featureToDelete: Feature | null = null
  isManager = false
  residenceName: string | null = null

  // Expose enums to template
  FeatureType = FeatureType
  FeatureCategory = FeatureCategory

  // Category icons mapping
  categoryIcons: Record<FeatureCategory, string> = {
    [FeatureCategory.LEISURE]: "umbrella-beach",
    [FeatureCategory.WELLNESS]: "spa",
    [FeatureCategory.MAINTENANCE]: "tools",
    [FeatureCategory.TRANSPORT]: "car",
    [FeatureCategory.CLEANING]: "broom",
    [FeatureCategory.CATERING]: "utensils",
    [FeatureCategory.EDUCATION]: "book",
    [FeatureCategory.SECURITY]: "shield-alt",
    [FeatureCategory.ENTERTAINMENT]: "film",
    [FeatureCategory.SPORT]: "running",
    [FeatureCategory.HEALTH]: "heartbeat",
    [FeatureCategory.KIDS]: "child",
    [FeatureCategory.BUSINESS]: "briefcase",
    [FeatureCategory.OTHER]: "ellipsis-h",
  }

  constructor() {
    this.filterForm = this.fb.group({
      search: [""],
      featureType: [null],
      featureCategory: [null],
      active: [null],
      sortBy: ["created_at"], // Utiliser le nom de colonne correct pour la base de données
      sortDir: ["desc"],
    })
  }

  ngOnInit(): void {
    // Check if user is a manager
    const currentUser = this.authService.getCurrentUser()
    this.isManager = currentUser?.role === Role.RESIDENCE_MANAGER || currentUser?.role === Role.SUB_RESIDENCE_MANAGER

    // Obtenir la résidence associée au manager ou au sous-manager
    if (currentUser) {
      if (currentUser.role === Role.RESIDENCE_MANAGER) {
        // Si l'utilisateur est un manager, obtenir sa résidence
        this.residenceService
          .getResidenceByManager(currentUser.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe((residence) => {
            this.residenceName = residence.name
            this.loadFeaturesForResidence()
          })
      } else if (currentUser.role === Role.SUB_RESIDENCE_MANAGER && currentUser.managerId) {
        // Si l'utilisateur est un sous-manager, obtenir la résidence de son manager
        this.residenceService
          .getResidenceByManager(currentUser.managerId)
          .pipe(takeUntil(this.destroy$))
          .subscribe((residence) => {
            this.residenceName = residence.name
            this.loadFeaturesForResidence()
          })
      } else {
        // Pour les autres rôles, charger tous les services
        this.loadFeaturesWithCurrentFilters()
      }
    } else {
      // Si pas d'utilisateur connecté, charger tous les services
      this.loadFeaturesWithCurrentFilters()
    }
  }

  loadFeaturesForResidence(): void {
    // Mettre à jour le formulaire avec le nom de la résidence
    this.store
      .select(selectFeatureFilters)
      .pipe(takeUntil(this.destroy$))
      .subscribe((filters) => {
        this.filterForm.patchValue({
          search: filters.search || "",
          featureType: filters.featureType || null,
          featureCategory: filters.featureCategory || null,
          active: filters.active === undefined ? null : filters.active,
          sortBy: filters.sortBy,
          sortDir: filters.sortDir,
        })

        // Créer des filtres avec le nom de la résidence
        const updatedFilters: FeatureFilters = {
          ...filters,
          residenceName: this.residenceName || undefined,
        }

        // Charger les services avec les filtres mis à jour
        this.store.dispatch(FeatureActions.loadFeatures({ filters: updatedFilters }))
      })
  }

  loadFeaturesWithCurrentFilters(): void {
    this.store
      .select(selectFeatureFilters)
      .pipe(takeUntil(this.destroy$))
      .subscribe((filters) => {
        this.filterForm.patchValue({
          search: filters.search || "",
          featureType: filters.featureType || null,
          featureCategory: filters.featureCategory || null,
          active: filters.active === undefined ? null : filters.active,
          sortBy: filters.sortBy,
          sortDir: filters.sortDir,
        })

        // Charger les services avec les filtres actuels
        this.store.dispatch(FeatureActions.loadFeatures({ filters }))
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  applyFilters(): void {
    const formValues = this.filterForm.value

    const filters: Partial<FeatureFilters> = {
      residenceName: this.residenceName || undefined,
      search: formValues.search || undefined,
      featureType: formValues.featureType || undefined,
      featureCategory: formValues.featureCategory || undefined,
      active: formValues.active === null ? undefined : formValues.active,
      sortBy: formValues.sortBy,
      sortDir: formValues.sortDir,
      page: 0, // Reset to first page when applying new filters
    }

    this.store.dispatch(FeatureActions.setFeatureFilters({ filters }))
  }

  resetFilters(): void {
    // Conserver le filtre de résidence lors de la réinitialisation
    const resetFilters = {
      residenceName: this.residenceName || undefined,
    }
    this.store.dispatch(FeatureActions.setFeatureFilters({ filters: resetFilters }))
    this.store.dispatch(FeatureActions.resetFeatureFilters())
  }

  onPageChange(page: number): void {
    this.store.dispatch(
      FeatureActions.setFeatureFilters({
        filters: { page },
      }),
    )
  }

  confirmDelete(feature: Feature): void {
    this.featureToDelete = feature
    this.showDeleteConfirm = true
  }

  deleteFeature(): void {
    if (this.featureToDelete) {
      this.store.dispatch(
        FeatureActions.deleteFeature({
          id: this.featureToDelete.id,
        }),
      )
      this.cancelDelete()
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false
    this.featureToDelete = null
  }

  getCategoryIcon(category: FeatureCategory): string {
    return this.categoryIcons[category] || "question"
  }

  formatFeatureType(type: FeatureType): string {
    return type
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  formatFeatureCategory(category: FeatureCategory): string {
    return category.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())
  }
}

