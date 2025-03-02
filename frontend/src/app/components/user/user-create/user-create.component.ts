import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import {  FormBuilder,  FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import  { Router } from "@angular/router"
import  { Store } from "@ngrx/store"
import { Role } from "../../../models/user.model"
import  { AuthService } from "../../../services/auth.service"
import * as UserActions from "../../../store/user.actions"

@Component({
  selector: "app-user-create",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./user-create.component.html",
})
export class UserCreateComponent implements OnInit {
  userForm: FormGroup
  isSubmitting = false
  availableRoles: Role[] = []


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
      managerId: [{ value: '', disabled: true }] // Champ caché
    });
    
  }

  ngOnInit(): void {
    this.setAvailableRoles()

    this.role?.valueChanges.subscribe((role) => {
      this.updateConditionalFields(role)
    })
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

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }
    
    this.isSubmitting = true;
    const userData = {...this.userForm.value};
    
    if (userData.role === Role.RESIDENCE_MANAGER) {
      delete userData.managerId;
    } 

    else if (userData.role === Role.SUB_RESIDENCE_MANAGER) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        userData.managerId = currentUser.id;
      }
    }


    else if (userData.role === Role.RESIDENT) {
      delete userData.managerId;
    }
    
    this.store.dispatch(UserActions.createUser({ user: userData }));
    
    setTimeout(() => {
      this.isSubmitting = false;
      this.router.navigate(['/users']);
    }, 1000);
  }
}

