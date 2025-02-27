import { Component, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { AuthService } from "../../services/auth.service"
import { finalize } from "rxjs"

@Component({
  selector: "app-reset-password",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="text-center text-3xl font-extrabold text-gray-900">Reset your password</h2>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          @if (success) {
            <div class="rounded-md bg-green-50 p-4 mb-4">
              <div class="flex">
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-800">Password reset successful</h3>
                  <div class="mt-2 text-sm text-green-700">
                    <p>Your password has been reset successfully. You can now log in with your new password.</p>
                  </div>
                  <div class="mt-4">
                    <a 
                      href="/login" 
                      class="text-sm font-medium text-green-800 hover:text-green-700"
                    >
                      Go to login
                    </a>
                  </div>
                </div>
              </div>
            </div>
          } @else if (error) {
            <div class="rounded-md bg-red-50 p-4 mb-4">
              <div class="flex">
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">An error occurred</h3>
                  <div class="mt-2 text-sm text-red-700">
                    <p>{{ error }}</p>
                  </div>
                </div>
              </div>
            </div>
          } @else {
            <form [formGroup]="resetPasswordForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <div>
                <label for="password" class="block text-sm font-medium text-gray-700">New password</label>
                <div class="mt-1">
                  <input 
                    id="password" 
                    name="password" 
                    type="password" 
                    formControlName="password"
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    [ngClass]="{'border-red-500': isFieldInvalid('password')}"
                  />
                  @if (isFieldInvalid('password')) {
                    <p class="mt-2 text-sm text-red-600">
                      Password must be at least 8 characters long
                    </p>
                  }
                </div>
              </div>

              <div>
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm password</label>
                <div class="mt-1">
                  <input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type="password" 
                    formControlName="confirmPassword"
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    [ngClass]="{'border-red-500': isFieldInvalid('confirmPassword')}"
                  />
                  @if (isFieldInvalid('confirmPassword')) {
                    <p class="mt-2 text-sm text-red-600">
                      Passwords do not match
                    </p>
                  }
                </div>
              </div>

              <div>
                <button 
                  type="submit" 
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  [disabled]="resetPasswordForm.invalid || isLoading"
                >
                  @if (isLoading) {
                    <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Processing...
                  } @else {
                    Reset Password
                  }
                </button>
              </div>
            </form>
          }
        </div>
      </div>
    </div>
  `,
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  resetPasswordForm!: FormGroup
  token = ""
  isLoading = false
  success = false
  error = ""

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams["token"] || ""

    if (!this.token) {
      this.error = "Invalid or missing reset token. Please request a new password reset link."
      return
    }

    this.resetPasswordForm = this.fb.group(
      {
        password: ["", [Validators.required, Validators.minLength(8)]],
        confirmPassword: ["", [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    )
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get("password")?.value
    const confirmPassword = form.get("confirmPassword")?.value

    return password === confirmPassword ? null : { passwordMismatch: true }
  }

  isFieldInvalid(field: string): boolean {
    const formControl = this.resetPasswordForm.get(field)
    return !!formControl && formControl.invalid && (formControl.dirty || formControl.touched)
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      Object.keys(this.resetPasswordForm.controls).forEach((key) => {
        const control = this.resetPasswordForm.get(key)
        control?.markAsTouched()
      })
      return
    }

    this.isLoading = true

    const resetRequest = {
      token: this.token,
      password: this.resetPasswordForm.get("password")?.value,
      confirmPassword: this.resetPasswordForm.get("confirmPassword")?.value,
    }

    this.authService
      .resetPassword(resetRequest)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.success = true
        },
        error: (err) => {
          this.error = err.error?.message || "An error occurred while resetting your password. Please try again."
        },
      })
  }
}

