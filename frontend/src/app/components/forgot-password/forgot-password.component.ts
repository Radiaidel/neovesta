import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import {  FormBuilder,  FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import  { Router } from "@angular/router"
import { AuthService } from "../../services/auth.service"
import { NotificationService } from "../../services/notification.service"


enum ResetStep {
  EMAIL = 0,
  NEW_PASSWORD = 1,
}

@Component({
  selector: "app-forgot-password",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./forgot-password.component.html",

})
export class ForgotPasswordComponent {
  ResetStep = ResetStep
  currentStep = ResetStep.EMAIL
  isLoading = false
  showPassword = false

  emailForm: FormGroup
  passwordForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
  ) {
    this.emailForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    })

    this.passwordForm = this.fb.group(
      {
        token: ["", [Validators.required]],
        newPassword: [
          "",
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
          ],
        ],
        confirmPassword: ["", Validators.required],
      },
      { validators: this.passwordMatchValidator },
    )
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get("newPassword")?.value
    const confirmPassword = group.get("confirmPassword")?.value
    return password === confirmPassword ? null : { passwordMismatch: true }
  }

  isFieldInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field)
    return !!(control && control.invalid && (control.dirty || control.touched))
  }

  submitEmail(): void {
    if (this.emailForm.invalid) return

    this.isLoading = true
    const request = { email: this.emailForm.get("email")?.value }

    this.authService.forgotPassword(request).subscribe({
      next: () => {
        this.isLoading = false
        this.currentStep = ResetStep.NEW_PASSWORD
        this.notificationService.success("Reset token has been sent to your email")
      },
      error: (error) => {
        this.isLoading = false
        this.notificationService.success("If the email exists, you will receive a reset token")
      },
    })
  }

  submitNewPassword(): void {
    if (this.passwordForm.invalid) return

    this.isLoading = true
    const request = {
      token: this.passwordForm.get("token")?.value,
      newPassword: this.passwordForm.get("newPassword")?.value,
      confirmPassword: this.passwordForm.get("confirmPassword")?.value,
    }

    this.authService.resetPassword(request).subscribe({
      next: () => {
        this.isLoading = false
        this.notificationService.success("Password has been reset successfully")
        this.router.navigate(["/login"])
      },
      error: (error) => {
        this.isLoading = false
        this.notificationService.error(error.error?.message || "Failed to reset password")
      },
    })
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword
  }
}

