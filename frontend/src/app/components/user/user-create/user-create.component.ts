import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { Store } from "@ngrx/store"
import { Role, UserResponse } from "../../../models/user.model"
import { AuthService } from "../../../services/auth.service"
import * as UserActions from "../../../store/user.actions"
import { Subject, takeUntil } from "rxjs"
import { selectUserCreationSuccess } from "../../../store/user.selectors"
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
  selector: "app-user-create",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: "./user-create.component.html",
})
export class UserCreateComponent implements OnInit {
  userForm: FormGroup
  isSubmitting = false
  availableRoles: Role[] = []
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private authService: AuthService,
  ) {


    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ["", [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      managerId: [{ value: '', disabled: true }] 
    });

  }

  ngOnInit(): void {
    this.setAvailableRoles()

    this.role?.valueChanges.subscribe((role) => {
      this.updateConditionalFields(role)
    })

    this.setupUserCreationListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupUserCreationListener(): void {
    this.store.select(selectUserCreationSuccess)
      .pipe(takeUntil(this.destroy$)) 
      .subscribe(createdUser => {
        if (createdUser) {
          this.handleUserCreationSuccess(createdUser);
        }
      });
  }

  private handleUserCreationSuccess(createdUser: UserResponse): void {
    this.isSubmitting = false;

    if (createdUser.role === Role.RESIDENT) {
      this.router.navigate(['/contracts/new'], {
        queryParams: { residentId: createdUser.id }
      });
    } else {
      this.router.navigate(['/users']);
    }

    this.store.dispatch(UserActions.resetCreatedUser());
  }

  private prepareUserData(): any {
    const formData = { ...this.userForm.value };
    const currentUser = this.authService.getCurrentUser();

    switch (formData.role) {
      case Role.SUB_RESIDENCE_MANAGER:
        formData.managerId = currentUser?.id;
        break;
      default:
        delete formData.managerId;
    }

    return formData;
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    this.isSubmitting = true;
    const userData = this.prepareUserData();
    this.store.dispatch(UserActions.createUser({ user: userData }));
  }
  get firstName() {
    return this.userForm.get("firstName")
  }
  get lastName() {
    return this.userForm.get("lastName")
  }
  get email() {
    return this.userForm.get("email")
  }
  get phoneNumber() {
    return this.userForm.get("phoneNumber")
  }
  get password() {
    return this.userForm.get("password")
  }
  get role() {
    return this.userForm.get("role")
  }
  get residenceId() {
    return this.userForm.get("residenceId")
  }
  get managerId() {
    return this.userForm.get("managerId")
  }

  setAvailableRoles(): void {
    const currentUserRole = this.authService.getCurrentUser()?.role

    if (!currentUserRole) {
      this.router.navigate(["/login"])
      return
    }

    switch (currentUserRole) {
      case Role.SUPER_ADMIN:
        this.availableRoles = [Role.ADMIN, Role.RESIDENCE_MANAGER]
        break
      case Role.ADMIN:
        this.availableRoles = [Role.RESIDENCE_MANAGER]
        break
      case Role.RESIDENCE_MANAGER:
        this.availableRoles = [Role.SUB_RESIDENCE_MANAGER, Role.RESIDENT]
        break
      case Role.SUB_RESIDENCE_MANAGER:
        this.availableRoles = [Role.RESIDENT]
        break
      default:
        this.availableRoles = []
    }

    if (this.availableRoles.length > 0) {
      this.role?.setValue(this.availableRoles[0])
      this.updateConditionalFields(this.availableRoles[0])
    }
  }

  updateConditionalFields(role: Role): void {


    this.managerId?.clearValidators();

    this.residenceId?.updateValueAndValidity();
    this.managerId?.updateValueAndValidity();
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

}

