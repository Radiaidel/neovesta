import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Residence, ResidenceStatus } from '../../../models/residence.model';
import * as ResidenceActions from '../../../store/residence/residence.actions';
import { selectLoading, selectSelectedResidence } from '../../../store/residence/residence.selectors';
import { ConfirmDialogComponent } from '../../ui/confirm-dialog/confirm-dialog.component';
import { LoadingSpinnerComponent } from '../../ui/loading-spinner/loading-spinner.component';
import { MapComponent } from '../../ui/map/map.component';
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
  selector: 'app-residence-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ConfirmDialogComponent,
    LoadingSpinnerComponent,
    MapComponent,
    HeaderComponent
],
  templateUrl: `./residence-detail.component.html`,
})
export class ResidenceDetailComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  residence$: Observable<Residence | null> = this.store.select(selectSelectedResidence);
  loading$: Observable<boolean> = this.store.select(selectLoading);

  showDeleteConfirm = false;
  residenceId: string | null = null;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.residenceId = id;
          this.store.dispatch(ResidenceActions.loadResidence({ id }));
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(ResidenceActions.resetSelectedResidence());
  }

  formatStatus(status: ResidenceStatus): string {
    return status.replace('_', ' ');
  }

  confirmDelete(): void {
    this.showDeleteConfirm = true;
  }

  deleteResidence(): void {
    if (this.residenceId) {
      this.store.dispatch(ResidenceActions.deleteResidence({ id: this.residenceId }));
      this.cancelDelete();
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }
}
