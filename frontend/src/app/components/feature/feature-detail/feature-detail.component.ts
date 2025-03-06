import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, Subject, takeUntil } from "rxjs";
import { Feature, FeatureCategory, FeatureType } from "../../../models/feature.model";
import { FeatureActions } from "../../../store/feature/feature.actions";
import { selectFeatureLoading, selectSelectedFeature } from "../../../store/feature/feature.selectors";
import { ConfirmDialogComponent } from "../../ui/confirm-dialog/confirm-dialog.component";
import { LoadingSpinnerComponent } from "../../ui/loading-spinner/loading-spinner.component";
import { AuthService } from "../../../services/auth.service";
import { Role } from "../../../models/user.model";
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
  selector: "app-feature-detail",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ConfirmDialogComponent,
    LoadingSpinnerComponent,
    HeaderComponent
],
  templateUrl: "./feature-detail.component.html",
})
export class FeatureDetailComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();

  feature$: Observable<Feature | null> = this.store.select(selectSelectedFeature);
  loading$: Observable<boolean> = this.store.select(selectFeatureLoading);

  showDeleteConfirm = false;
  featureId: string | null = null;
  isManager = false;

  categoryColors: Record<FeatureCategory, string> = {
    [FeatureCategory.LEISURE]: "bg-blue-100 text-blue-800",
    [FeatureCategory.WELLNESS]: "bg-purple-100 text-purple-800",
    [FeatureCategory.MAINTENANCE]: "bg-yellow-100 text-yellow-800",
    [FeatureCategory.TRANSPORT]: "bg-indigo-100 text-indigo-800",
    [FeatureCategory.CLEANING]: "bg-cyan-100 text-cyan-800",
    [FeatureCategory.CATERING]: "bg-orange-100 text-orange-800",
    [FeatureCategory.EDUCATION]: "bg-lime-100 text-lime-800",
    [FeatureCategory.SECURITY]: "bg-red-100 text-red-800",
    [FeatureCategory.ENTERTAINMENT]: "bg-pink-100 text-pink-800",
    [FeatureCategory.SPORT]: "bg-green-100 text-green-800",
    [FeatureCategory.HEALTH]: "bg-rose-100 text-rose-800",
    [FeatureCategory.KIDS]: "bg-amber-100 text-amber-800",
    [FeatureCategory.BUSINESS]: "bg-slate-100 text-slate-800",
    [FeatureCategory.OTHER]: "bg-gray-100 text-gray-800",
  };

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
  };

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.isManager = currentUser?.role === Role.RESIDENCE_MANAGER || currentUser?.role === Role.SUB_RESIDENCE_MANAGER;

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get("id");
      if (id) {
        this.featureId = id;
        this.store.dispatch(FeatureActions.loadFeature({ id }));
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(FeatureActions.resetSelectedFeature());
  }

  confirmDelete(): void {
    this.showDeleteConfirm = true;
  }

  deleteFeature(): void {
    if (this.featureId) {
      this.store.dispatch(FeatureActions.deleteFeature({ id: this.featureId }));
      this.cancelDelete();
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  formatFeatureType(type: FeatureType): string {
    return type.replace("_", " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  }

  formatFeatureCategory(category: FeatureCategory): string {
    return category.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  }

  getCategoryColor(category: FeatureCategory): string {
    return this.categoryColors[category] || "bg-gray-100 text-gray-800";
  }

  getCategoryIcon(category: FeatureCategory): string {
    return this.categoryIcons[category] || "question";
  }

  formatDateTime(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  }
}
