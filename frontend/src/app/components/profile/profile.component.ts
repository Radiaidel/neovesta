import { Component, type OnInit, type OnDestroy, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Store } from "@ngrx/store"
import { Subject, takeUntil } from "rxjs"
import { ProfileActions } from "../../store/profile/profile.actions"
import {
  selectProfileUser,
  selectProfileLoading,
  selectProfileError,
  selectIsResidenceManager,
} from "../../store/profile/profile.selectors"
import type { ProfileUser } from "../../models/profile.model"
import { AuthService } from "../../services/auth.service"
import { ProfilePasswordComponent } from "./profile-password/profile-password.component"
import { ProfileResidenceComponent } from "./profile-residence/profile-residence.component"
import { HeaderComponent } from "../shared/header/header.component";
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProfilePasswordComponent, ProfileResidenceComponent, HeaderComponent],
  templateUrl: "./profile.component.html",
})
export class ProfileComponent implements OnInit, OnDestroy {
  private store = inject(Store)
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private destroy$ = new Subject<void>()
  private cdRef = inject(ChangeDetectorRef);


  user: ProfileUser | null = null
  loading = false
  error: string | null = null
  profileForm!: FormGroup
  selectedFile: File | null = null
  isResidenceManager$ = this.store.select(selectIsResidenceManager)
  activeTab = 0
  tempProfilePicture: string | null = null;

  ngOnInit(): void {
    this.initForm()
    this.loadUserData()

    this.store.select(selectProfileUser)
    .pipe(takeUntil(this.destroy$))
    .subscribe((user) => {
      if (user) {
        // Effacer l'image temporaire quand le store est mis à jour
        if (this.tempProfilePicture && user.profilePictureUrl) {
          this.tempProfilePicture = null;
        }
        this.user = user;
        this.updateForm(user);
      }
    });

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

  private initForm(): void {
    this.profileForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phoneNumber: ["", [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]],
    })
  }

  private updateForm(user: ProfileUser): void {
    this.profileForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    })
  }

  private loadUserData(): void {
    const currentUser = this.authService.getCurrentUser()
    if (currentUser) {
      this.store.dispatch(ProfileActions.loadProfile({ id: currentUser.id }))

      if (currentUser.role === "RESIDENCE_MANAGER" || currentUser.role === "SUB_RESIDENCE_MANAGER") {
        this.store.dispatch(ProfileActions.loadResidenceProfile({ managerId: currentUser.id }))
      }
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.user) {
      if (this.selectedFile) {
        const formData = new FormData();
        
        Object.keys(this.profileForm.value).forEach(key => {
          if (this.profileForm.value[key] !== null && this.profileForm.value[key] !== undefined) {
            formData.append(key, this.profileForm.value[key]);
          }
        });
        
        formData.append("profilePicture", this.selectedFile);
        
        this.store.dispatch(
          ProfileActions.updateProfile({
            id: this.user.id,
            request: formData,
          }),
        );
      } else {
        const updateRequest = this.profileForm.value;
        this.store.dispatch(
          ProfileActions.updateProfile({
            id: this.user.id,
            request: updateRequest,
          }),
        );
      }
    }
  }
onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0];
    
    // Lire le fichier et générer une URL temporaire
    const reader = new FileReader();
    reader.onload = (e) => {
      this.tempProfilePicture = e.target?.result as string; // Stocker l'URL temporaire
      this.cdRef.detectChanges(); // Forcer la mise à jour du template
    };
    reader.readAsDataURL(this.selectedFile);

    // Envoyer l'image au serveur
    if (this.user) {
      const formData = new FormData();
      formData.append("profilePicture", this.selectedFile); // Nom correct pour le backend
      
      // Ajouter les autres champs du formulaire si nécessaire
      Object.keys(this.profileForm.value).forEach(key => {
        formData.append(key, this.profileForm.value[key]);
      });

      this.store.dispatch(
        ProfileActions.updateProfile({
          id: this.user.id,
          request: formData,
        }),
      );
    }
  }
}

  onImageUploadSuccess(): void {
    this.error = null
    const successMessage = "Profile image updated successfully"
    console.log(successMessage)
  }

  setActiveTab(index: number): void {
    this.activeTab = index
  }

  getRoleDisplay(role?: string): string {
    if (!role) return ""

    switch (role) {
      case "SUPER_ADMIN":
        return "Super Admin"
      case "ADMIN":
        return "Admin"
      case "RESIDENCE_MANAGER":
        return "Residence Manager"
      case "SUB_RESIDENCE_MANAGER":
        return "Sub-Residence Manager"
      case "RESIDENT":
        return "Resident"
      default:
        return role
    }
  }

  private getErrorMessage(error: any): string {
    if (typeof error === "string") return error
    if (error.error?.message) return error.error.message
    if (error.message) return error.message
    return "An unknown error occurred"
  }

  getInitials(firstName?: string, lastName?: string): string {
    if (!firstName && !lastName) return "U"

    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : ""
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : ""

    return `${firstInitial}${lastInitial}`
  }

  getAvatarBgColor(name?: string): string {
    if (!name) return "bg-blue-500"

    const hash = Array.from(name).reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc)
    }, 0)

    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ]

    const index = Math.abs(hash) % colors.length
    return colors[index]
  }
}

