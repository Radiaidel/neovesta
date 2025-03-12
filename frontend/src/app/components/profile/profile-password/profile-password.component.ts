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
  template: `
    <div class="space-y-6">
      <div>
        <h3 class="text-lg font-medium leading-6 text-gray-900">Changer le mot de passe</h3>
        <p class="mt-1 text-sm text-gray-500">Mettez à jour votre mot de passe.</p>
      </div>
      
      <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div class="space-y-4">
          <div>
            <label for="currentPassword" class="block text-sm font-medium text-gray-700">Mot de passe actuel</label>
            <div class="mt-1">
              <input 
                type="password" 
                id="currentPassword" 
                formControlName="currentPassword"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
            </div>
            <div *ngIf="passwordForm.get('currentPassword')?.invalid && passwordForm.get('currentPassword')?.touched" class="text-red-500 text-sm mt-1">
              Le mot de passe actuel est requis
            </div>
          </div>

          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
            <div class="mt-1">
              <input 
                type="password" 
                id="newPassword" 
                formControlName="newPassword"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
            </div>
            <div *ngIf="passwordForm.get('newPassword')?.invalid && passwordForm.get('newPassword')?.touched" class="text-red-500 text-sm mt-1">
              <span *ngIf="passwordForm.get('newPassword')?.errors?.['required']">Le nouveau mot de passe est requis</span>
              <span *ngIf="passwordForm.get('newPassword')?.errors?.['minlength']">Le mot de passe doit contenir au moins 8 caractères</span>
            </div>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
            <div class="mt-1">
              <input 
                type="password" 
                id="confirmPassword" 
                formControlName="confirmPassword"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
            </div>
            <div *ngIf="passwordForm.get('confirmPassword')?.invalid && passwordForm.get('confirmPassword')?.touched" class="text-red-500 text-sm mt-1">
              <span *ngIf="passwordForm.get('confirmPassword')?.errors?.['required']">La confirmation du mot de passe est requise</span>
              <span *ngIf="passwordForm.get('confirmPassword')?.errors?.['mustMatch']">Les mots de passe ne correspondent pas</span>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button 
            type="submit" 
            [disabled]="passwordForm.invalid || isSubmitting"
            class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span *ngIf="isSubmitting">Mise à jour...</span>
            <span *ngIf="!isSubmitting">Mettre à jour</span>
          </button>
        </div>
      </form>
      
      <div *ngIf="errorMessage" class="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
        {{ errorMessage }}
      </div>
      
      <div *ngIf="updateSuccess" class="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
        Votre mot de passe a été mis à jour avec succès.
      </div>
    </div>
  `,
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

