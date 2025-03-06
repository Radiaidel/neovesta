import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import {  FormBuilder,  FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import  { ActivatedRoute, Router } from "@angular/router"
import  { Store } from "@ngrx/store"
import  { Observable } from "rxjs"
import  { UserResponse } from "../../../models/user.model"
import * as UserActions from "../../../store/user.actions"
import * as UserSelectors from "../../../store/user.selectors"

@Component({
  selector: "app-user-edit",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./user-edit.component.html",
})
export class UserEditComponent implements OnInit {
  userForm: FormGroup
  selectedUser$: Observable<UserResponse | null>
  userId: string | null = null
  isSubmitting = false

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.userForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phoneNumber: ["", Validators.required],
    })

    this.selectedUser$ = this.store.select(UserSelectors.selectSelectedUser)
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get("id")
    if (this.userId) {
      this.store.dispatch(UserActions.loadUserById({ userId: this.userId }))

      this.selectedUser$.subscribe((user) => {
        if (user) {
          this.userForm.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
          })
        }
      })
    }
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

  onSubmit(): void {
    if (this.userForm.invalid || !this.userId) {
      return
    }

    this.isSubmitting = true

    this.store.dispatch(
      UserActions.updateUser({
        userId: this.userId,
        user: this.userForm.value,
      }),
    )

    // Navigate back after update
    setTimeout(() => {
      this.isSubmitting = false
      this.router.navigate(["/users", this.userId])
    }, 1000)
  }

  goBack(): void {
    if (this.userId) {
      this.router.navigate(["/users", this.userId])
    } else {
      this.router.navigate(["/users"])
    }
  }
}

