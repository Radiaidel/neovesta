import { Component, type OnDestroy, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { Store } from "@ngrx/store"
import { map, type Observable, Subject, takeUntil } from "rxjs"
import type { PageResponse, Residence, ResidenceFilters } from "../../../models/residence.model"
import { ResidenceActions } from "../../../store/residence/residence.actions"
import {
  selectAllResidences,
  selectCities,
  selectCurrentPage,
  selectFilters,
  selectIsFirstPage,
  selectIsLastPage,
  selectLoading,
  selectTotalPages,
} from "../../../store/residence/residence.selectors"
import { FormBuilder, type FormGroup } from "@angular/forms"
import { ConfirmDialogComponent } from "../../ui/confirm-dialog/confirm-dialog.component"
import { ResidenceCardComponent } from "../residence-card/residence-card.component"
import { LoadingSpinnerComponent } from "../../ui/loading-spinner/loading-spinner.component"
import { PaginationComponent } from "../../ui/pagination/pagination.component"
import { HeaderComponent } from "../../shared/header/header.component";
import { AuthService } from "../../../services/auth.service"
import { Role, User } from "../../../models/user.model"

@Component({
  selector: "app-residence-list",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmDialogComponent,
    ResidenceCardComponent,
    LoadingSpinnerComponent,
    PaginationComponent,
    HeaderComponent
  ],
  templateUrl: "./residence-list.component.html",
})
export class ResidenceListComponent implements OnInit, OnDestroy {
  private store = inject(Store)
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)

  private destroy$ = new Subject<void>()

  residences$: Observable<PageResponse<Residence> | null> = this.store.select(selectAllResidences)
  cities$: Observable<PageResponse<string> | null> = this.store.select(selectCities)
  loading$: Observable<boolean> = this.store.select(selectLoading)
  currentPage$: Observable<number> = this.store.select(selectCurrentPage)
  totalPages$: Observable<number> = this.store.select(selectTotalPages)
  isFirstPage$: Observable<boolean> = this.store.select(selectIsFirstPage)
  isLastPage$: Observable<boolean> = this.store.select(selectIsLastPage)

  filterForm: FormGroup
  selectedAmenities: string[] = []
  showDeleteConfirm = false
  residenceToDelete: Residence | null = null
  showSidebar = true
  isAdmin: boolean = false 
  commonAmenities = ["Wifi", "Parking", "Pool", "Gym", "Security", "Elevator", "Air Conditioning"]

  constructor() {
    this.filterForm = this.fb.group({
      search: [""],
      city: [""],
      minPrice: [null],
      maxPrice: [null],
      sortBy: ["createdAt"],
      sortDir: ["desc"],
    })
  }

  ngOnInit(): void {

    this.authService.currentUser$.subscribe(user => {
      this.isAdmin = user?.role === Role.ADMIN || user?.role === Role.SUPER_ADMIN ? true : false;
    });



    this.store.dispatch(ResidenceActions.loadCities({ page: 0, size: 100 }))

    this.store
      .select(selectFilters)
      .pipe(takeUntil(this.destroy$))
      .subscribe((filters) => {
        this.filterForm.patchValue({
          search: filters.search || "",
          city: filters.city || "",
          minPrice: filters.minPrice || null,
          maxPrice: filters.maxPrice || null,
          sortBy: filters.sortBy,
          sortDir: filters.sortDir,
        })

        this.selectedAmenities = filters.amenities || []

        this.store.dispatch(ResidenceActions.loadResidences({ filters }))
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  toggleAmenity(amenity: string): void {
    const index = this.selectedAmenities.indexOf(amenity)
    if (index === -1) {
      this.selectedAmenities.push(amenity)
    } else {
      this.selectedAmenities.splice(index, 1)
    }
  }

  applyFilters(): void {
    const formValues = this.filterForm.value

    const filters: Partial<ResidenceFilters> = {
      search: formValues.search || undefined,
      city: formValues.city || undefined,
      minPrice: formValues.minPrice || undefined,
      maxPrice: formValues.maxPrice || undefined,
      amenities: this.selectedAmenities.length ? this.selectedAmenities : undefined,
      sortBy: formValues.sortBy,
      sortDir: formValues.sortDir,
      page: 0,
    }

    this.store.dispatch(ResidenceActions.setFilters({ filters }))
  }

  resetFilters(): void {
    this.store.dispatch(ResidenceActions.resetFilters())
    this.selectedAmenities = []
  }

  onPageChange(page: number): void {
    this.store.dispatch(
      ResidenceActions.setFilters({
        filters: { page },
      }),
    )
  }

  confirmDelete(residence: Residence): void {
    this.residenceToDelete = residence
    this.showDeleteConfirm = true
  }

  deleteResidence(): void {
    if (this.residenceToDelete) {
      this.store.dispatch(
        ResidenceActions.deleteResidence({
          id: this.residenceToDelete.id,
        }),
      )
      this.cancelDelete()
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false
    this.residenceToDelete = null
  }
  // Helper method for formatting status
  formatStatus(status: string): string {
    if (!status) return '';
    return status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }


  // Add this property to your class
  viewMode: 'grid' | 'list' = 'grid';

  // Add this method to your class
  toggleViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }



  // Add these properties for the statistics in the hero section
  totalItems$: Observable<number> = this.residences$.pipe(
    map(response => response?.totalElements || 0)
  );

  activeCount$: Observable<number> = this.residences$.pipe(
    map(response => response?.content?.filter(r => r.status === 'ACTIVE')?.length || 0)
  );

  availableUnits$: Observable<number> = this.residences$.pipe(
    map(response => response?.content?.reduce((sum, r) => sum + (r.availableApartments || 0), 0) || 0)
  );

  // Add this for the advanced filters toggle
  showAdvancedFilters = false;

  // Add this method for toggling advanced filters
  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters
  }


}

