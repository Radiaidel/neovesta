import { Component,  OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import  { Store } from "@ngrx/store"
import  { filter, Observable } from "rxjs"
import  { UserResponse, PageResponse } from "../../../models/user.model"
import { Role } from "../../../models/user.model"
import { AuthService } from "../../../services/auth.service"
import * as UserActions from "../../../store/user.actions"
import * as UserSelectors from "../../../store/user.selectors"
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
  selector: "app-user-list",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent],
  templateUrl: "./user-list.component.html",
})
export class UserListComponent implements OnInit {
  users$?: Observable<PageResponse<UserResponse>>
  searchTerm = ""
  selectedRole: Role | null = null
  currentPage = 0
  pageSize = 10
  Math = Math

  availableRoles: Role[] = [
    Role.SUPER_ADMIN,
    Role.ADMIN,
    Role.RESIDENCE_MANAGER,
    Role.SUB_RESIDENCE_MANAGER,
    Role.RESIDENT,
  ]

  constructor(
    private store: Store,
    private authService: AuthService,
  ) {
    this.users$ = this.store.select(UserSelectors.selectUsers).pipe(filter((users) => !!users));
  }

  ngOnInit(): void {
    this.loadUsers()
  }

  loadUsers(): void {
    this.store.dispatch(
      UserActions.loadUsers({
        request: {
          searchTerm: this.searchTerm,
          role: this.selectedRole,
          page: this.currentPage,
          size: this.pageSize,
        },
      }),
    )
  }

  search(): void {
    this.currentPage = 0
    this.loadUsers()
  }

  filterByRole(): void {
    this.currentPage = 0
    this.loadUsers()
  }

  nextPage(): void {
    this.currentPage++
    this.loadUsers()
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--
      this.loadUsers()
    }
  }

  toggleUserStatus(userId: string): void {
    this.store.dispatch(UserActions.toggleUserStatus({ userId }))
  }

  deleteUser(userId: string): void {
    if (confirm("Are you sure you want to delete this user?")) {
      this.store.dispatch(UserActions.deleteUser({ userId }))
    }
  }

  canCreateUser(): boolean {
    return this.authService.hasRole([Role.SUPER_ADMIN, Role.ADMIN, Role.RESIDENCE_MANAGER, Role.SUB_RESIDENCE_MANAGER])
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
}

