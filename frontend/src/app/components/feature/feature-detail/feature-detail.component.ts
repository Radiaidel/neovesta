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
import { 
  faUmbrellaBeach, 
  faSpa,
  faTools,
  faCar,
  faBroom,
  faUtensils,
  faBookOpen,
  faShieldAlt,
  faFilm,
  faDumbbell,
  faHeartbeat,
  faChild,
  faBriefcase,
  faInfoCircle,
  faCheck,
  faTimes,
  faCalendarAlt,
  faCalendarCheck,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary, FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@Component({
  selector: "app-feature-detail",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ConfirmDialogComponent,
    LoadingSpinnerComponent,
    HeaderComponent,
    FontAwesomeModule
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

  getCategoryIcon(category: FeatureCategory): IconDefinition {
    const iconMap: Record<FeatureCategory, IconDefinition> = {
      [FeatureCategory.LEISURE]: faUmbrellaBeach,
      [FeatureCategory.WELLNESS]: faSpa,
      [FeatureCategory.MAINTENANCE]: faTools,
      [FeatureCategory.TRANSPORT]: faCar,
      [FeatureCategory.CLEANING]: faBroom,
      [FeatureCategory.CATERING]: faUtensils,
      [FeatureCategory.EDUCATION]: faBookOpen,
      [FeatureCategory.SECURITY]: faShieldAlt,
      [FeatureCategory.ENTERTAINMENT]: faFilm,
      [FeatureCategory.SPORT]: faDumbbell,
      [FeatureCategory.HEALTH]: faHeartbeat,
      [FeatureCategory.KIDS]: faChild,
      [FeatureCategory.BUSINESS]: faBriefcase,
      [FeatureCategory.OTHER]: faInfoCircle
    };
  
    return iconMap[category] || faInfoCircle;
  }
  private library = inject(FaIconLibrary);
  constructor(){
    this.library.addIcons(
      faUmbrellaBeach, 
      faSpa,
      faTools,
      faCar,
      faBroom,
      faUtensils,
      faBookOpen,
      faShieldAlt,
      faFilm,
      faDumbbell,
      faHeartbeat,
      faChild,
      faBriefcase,
      faInfoCircle,
      faCheck,
      faTimes,
      faCalendarAlt,
      faCalendarCheck
    );
  }

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


  formatDateTime(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  categoryDefaultImages: Record<FeatureCategory, string> = {
    [FeatureCategory.LEISURE]: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    [FeatureCategory.WELLNESS]: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    [FeatureCategory.MAINTENANCE]: 'https://plus.unsplash.com/premium_photo-1721830791498-ec809d9d94ec?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Outils de réparation
    [FeatureCategory.TRANSPORT]: 'https://images.unsplash.com/photo-1502872364588-894d7d6ddfab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Bus
    [FeatureCategory.CLEANING]: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    [FeatureCategory.CATERING]: 'https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    [FeatureCategory.EDUCATION]: 'https://plus.unsplash.com/premium_photo-1677567996070-68fa4181775a?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Salle de classe
    [FeatureCategory.SECURITY]: 'https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    [FeatureCategory.ENTERTAINMENT]: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    [FeatureCategory.SPORT]: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Football
    [FeatureCategory.HEALTH]: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    [FeatureCategory.KIDS]: 'https://images.unsplash.com/photo-1577896852336-9e9c1452f5e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Enfant qui joue
    [FeatureCategory.BUSINESS]: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    [FeatureCategory.OTHER]: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Bureau générique
  };
  

  
  getCategoryImage(category: FeatureCategory): string {
    // Utiliser la même logique que dans la carte
    return this.categoryDefaultImages[category];
  }
}
