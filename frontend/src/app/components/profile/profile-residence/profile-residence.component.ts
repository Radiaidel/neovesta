import { Component, type OnInit, type OnDestroy, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Store } from "@ngrx/store"
import { Subject, takeUntil } from "rxjs"

import {
  selectProfileResidence,
  selectProfileLoading,
  selectProfileError,
} from "../../../store/profile/profile.selectors"
import type { ProfileResidence } from "../../../models/profile.model"
import { ProfileResidenceEditComponent } from "../update-residence-form/profile-residence-edit.component"
import { ProfileActions } from "../../../store/profile/profile.actions"
import { AuthService } from "../../../services/auth.service"

@Component({
  selector: "app-profile-residence",
  standalone: true,
  imports: [CommonModule, ProfileResidenceEditComponent],
  templateUrl: "./profile-residence.component.html",
})
export class ProfileResidenceComponent implements OnInit, OnDestroy {
  private store = inject(Store)
  private destroy$ = new Subject<void>()
  private authService = inject(AuthService)

  residence: ProfileResidence | null = null
  loading = false
  error: string | null = null
  activeImageIndex = 0
  isEditing = false
  updateSuccess = false

  ngOnInit(): void {
    this.store
      .select(selectProfileResidence)
      .pipe(takeUntil(this.destroy$))
      .subscribe((residence) => {
        this.residence = residence
      })

    this.store
      .select(selectProfileLoading)
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => {
        this.loading = loading
      })

    this.store
      .select(selectProfileError)
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        if (error) {
          this.error = this.getErrorMessage(error)
        } else {
          this.error = null
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  setActiveImage(index: number): void {
    this.activeImageIndex = index
  }

  downloadDocument(url: string): void {
    window.open(url, "_blank")
  }

  private getErrorMessage(error: any): string {
    if (typeof error === "string") return error
    if (error.error?.message) return error.error.message
    if (error.message) return error.message
    return "An unknown error occurred"
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing
    this.error = null
  }

  saveResidence(updatedResidence: any): void {
    const currentUser = this.authService.getCurrentUser()
    if (currentUser && this.residence) {
      const request = {
        ...updatedResidence,
        id: this.residence.id,
      }

      console.log("Sending residence update request:", request)

      this.store.dispatch(
        ProfileActions.updateResidence({
          residenceId: this.residence.id,
          request,
        }),
      )

      this.store
        .select(selectProfileLoading)
        .pipe(takeUntil(this.destroy$))
        .subscribe((loading) => {
          this.loading = loading

          if (!loading && !this.error) {
            this.updateSuccess = true
            this.isEditing = false

            setTimeout(() => {
              this.updateSuccess = false
            }, 5000)
          }
        })
    }
  }
}

