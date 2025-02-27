import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { AuthService } from "../../services/auth.service"
import { finalize } from "rxjs"

@Component({
  selector: "app-forgot-password",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="text-center text-3xl font-extrabold text-gray-900">Forgot your password?</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Don't worry. We'll send you a reset link.
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          @if (success) {
            <div class="rounded-md bg-green-50 p-4 mb-4">
              <div class="flex">
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-800">Password reset email sent</h3>
                  <div class="mt-2 text-sm text-green-700">
                    <p>Please check your email for the password reset link.</p>
                  </div>
                </div>
              </div>
            </div>
          }
          
          <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
              <div class="mt-1">
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  formControlName="email"
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  [ngClass]="{'border-red-500': isFieldInvalid('email')}"
                />
                @if (isFieldInvalid('email')) {
                  <p class="mt-2 text-sm text-red-600">Please enter a valid email address</p>
                }
              </div>
            </div>

            <div>
              <button 
                type="submit" 
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                [disabled]="forgotPasswordForm.invalid || isLoading"
              >
                @if (isLoading) {
                  <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Processing...
                } @else {
                  Send Reset Link
                }
              </button>
            </div>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">
                  Or
                </span>
              </div>
            </div>

            <div class="mt-6">
              <a 
                href="/login" 
                class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Back to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private router = inject(Router)

  forgotPasswordForm!: FormGroup
  isLoading = false
  success = false

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    })
  }

  isFieldInvalid(field: string): boolean {
    const formControl = this.forgotPasswordForm.get(field)
    return !!formControl && formControl.invalid && (formControl.dirty || formControl.touched)
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      Object.keys(this.forgotPasswordForm.controls).forEach((key) => {
        const control = this.forgotPasswordForm.get(key)
        control?.markAsTouched()
      })
      return
    }

    this.isLoading = true

    this.authService
      .forgotPassword(this.forgotPasswordForm.value)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.success = true
        },
        error: (err) => {
          // Even if error occurs, we don't show it to the user for security reasons
          // We still show success message to prevent email enumeration attacks
          this.success = true
        },
      })
  }
}

