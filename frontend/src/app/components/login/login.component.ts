import { Component, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, ActivatedRoute } from "@angular/router"
import { AuthService } from "../../services/auth.service"
import { finalize } from "rxjs"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  loginForm!: FormGroup
  isLoading = false
  error = ""
  showPassword = false

  ngOnInit(): void {
    this.initForm()
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
      rememberMe: [false],
    })
  }

  isFieldInvalid(field: string): boolean {
    const formControl = this.loginForm.get(field)
    return !!formControl && formControl.invalid && (formControl.dirty || formControl.touched)
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach((key) => {
        const control = this.loginForm.get(key)
        control?.markAsTouched()
      })
      return
    }

    this.isLoading = true
    this.error = ""

    this.authService
      .login(this.loginForm.value)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/"
          this.router.navigate([returnUrl])
        },
        error: (err) => {
          this.error = err.error?.message || "Login failed. Please check your credentials and try again."
        },
      })
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword
  }
}

