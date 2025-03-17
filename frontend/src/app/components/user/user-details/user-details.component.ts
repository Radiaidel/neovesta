import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import {  ActivatedRoute,  Router, RouterModule } from "@angular/router"
import  { Store } from "@ngrx/store"
import  { Observable } from "rxjs"
import  { UserResponse } from "../../../models/user.model"
import  { AuthService } from "../../../services/auth.service"
import { Role } from "../../../models/user.model"
import * as UserActions from "../../../store/user.actions"
import * as UserSelectors from "../../../store/user.selectors"
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
  selector: "app-user-details",
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: "./user-details.component.html",
})
export class UserDetailsComponent implements OnInit {
  selectedUser$: Observable<UserResponse | null>
  userId: string | null = null

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {
    this.selectedUser$ = this.store.select(UserSelectors.selectSelectedUser)
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get("id")
    if (this.userId) {
      this.store.dispatch(UserActions.loadUserById({ userId: this.userId }))
    }
  }

  toggleUserStatus(userId: string): void {
    this.store.dispatch(UserActions.toggleUserStatus({ userId }))
  }

  deleteUser(userId: string): void {
    if (confirm("Are you sure you want to delete this user?")) {
      this.store.dispatch(UserActions.deleteUser({ userId }))
      this.router.navigate(["/users"])
    }
  }

  canEditUser(user: UserResponse): boolean {
    const currentUser = this.authService.getCurrentUser()
    if (!currentUser) return false

    if (currentUser.id === user.id) return true

    return this.authService.hasRole([Role.SUPER_ADMIN, Role.ADMIN])
  }

  canToggleUserStatus(): boolean {
    return this.authService.hasRole([Role.SUPER_ADMIN, Role.ADMIN])
  }

  canDeleteUser(): boolean {
    return this.authService.hasRole([Role.SUPER_ADMIN])
  }

  goBack(): void {
    this.router.navigate(["/users"])
  }
}

