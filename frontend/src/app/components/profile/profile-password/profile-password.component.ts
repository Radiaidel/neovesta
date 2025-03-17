import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Store } from "@ngrx/store"
import { firstValueFrom } from "rxjs"
import { Router } from "@angular/router"
import { ProfileActions } from "../../../store/profile/profile.actions"
import { HttpErrorResponse } from "@angular/common/http"
import { AuthService } from "../../../services/auth.service"
import { ToastService } from "../../../services/toast.service"
import { selectPasswordUpdateSuccess, selectProfileError } from "../../../store/profile/profile.selectors"

@Component({
  selector: "app-profile-password",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./profile-password.component.html",
})
export class ProfilePasswordComponent {
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private authService = inject(AuthService)
  private store = inject(Store)
  private toastr = inject(ToastService);

  passwordForm: FormGroup
  isSubmitting = false
  updateSuccess = false
  errorMessage: string | null = null

  constructor() {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ["", Validators.required],
        newPassword: ["", [Validators.required, Validators.minLength(8)]],
        confirmPassword: ["", Validators.required],
      },
      {
        validators: this.mustMatch("newPassword", "confirmPassword"),
      },
    )
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName]
      const matchingControl = formGroup.controls[matchingControlName]

      if (matchingControl.errors && !matchingControl.errors["mustMatch"]) {
        return
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true })
      } else {
        matchingControl.setErrors(null)
      }
    }
  }

  async onSubmit(): Promise<void> {
    if (this.passwordForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = null;
  
      try {
        const currentUser = await firstValueFrom(this.store.select((state) => state.user.currentUser));
  
        if (currentUser) {
          this.store.dispatch(
            ProfileActions.updatePassword({
              id: currentUser.id,
              request: {
                currentPassword: this.passwordForm.value.currentPassword,
                newPassword: this.passwordForm.value.newPassword,
              },
            })
          );
  
          const successSubscription = this.store
            .select(selectPasswordUpdateSuccess)
            .subscribe((success) => {
              if (success) {
                this.isSubmitting = false;
                this.toastr.show('Votre mot de passe a été mis à jour avec succès.', 'success');
                this.passwordForm.reset();
                successSubscription.unsubscribe();
                
                this.authService.logout();
                this.router.navigate(['/login']);
              }
            });
  
          const errorSubscription = this.store
            .select(selectProfileError)
            .subscribe((error) => {
              if (error) {
                this.isSubmitting = false;
                this.toastr.show(
                  error.message || "Une erreur est survenue lors de la mise à jour du mot de passe.",
                  'error'
                );
                errorSubscription.unsubscribe();
              }
            });
        }
      } catch (error) {
        this.isSubmitting = false;
        
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            this.toastr.show("Mot de passe actuel incorrect", 'error');
          } else {
            this.toastr.show("Une error serveur est survenue", 'error');
          }
          
          if (error.status !== 401 && error.status !== 403) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      }
    }
  }
}

