import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { Store } from "@ngrx/store";
import { debounceTime, distinctUntilChanged, filter, Observable, Subject, takeUntil, map } from "rxjs";
import { UserResponse, PageResponse, UserSearchRequest, Role } from "../../../models/user.model";
import { AuthService } from "../../../services/auth.service";
import * as UserActions from "../../../store/user.actions";
import * as UserSelectors from "../../../store/user.selectors";
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
  selector: "app-user-list",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent],
  templateUrl: "./user-list.component.html",
})
export class UserListComponent implements OnInit, OnDestroy {
  users$: Observable<PageResponse<UserResponse>>;
  filteredUsers$: Observable<UserResponse[]>;
  filteredUsersCount = 0;

  searchTerm = "";
  selectedRole: Role | null = null;
  currentPage = 0;
  pageSize = 10;
  Math = Math;
  availableRoles: Role[] = [];

  private searchTerms = new Subject<string>();
  private roleSelections = new Subject<Role | null>();
  private destroy$ = new Subject<void>();
  private currentUser = this.authService.getCurrentUser();

  constructor(
    private store: Store,
    private authService: AuthService,
  ) {
    this.users$ = this.store.select(UserSelectors.selectUsers).pipe(
      filter((users): users is PageResponse<UserResponse> => users !== null)
    );

    // Créer un observable pour les utilisateurs filtrés
    this.filteredUsers$ = this.users$.pipe(
      map(usersPage => {
        const filtered = this.filterUsersByRole(usersPage.content || []);
        this.filteredUsersCount = filtered.length;
        return filtered;
      })
    );
  }

  ngOnInit(): void {
    this.setAvailableRoles();
    this.setupRealTimeSearch();
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterUsersByRole(users: UserResponse[]): UserResponse[] {
    if (!this.currentUser || !this.currentUser.role) {
      return users;
    }

    let filtered = users;

    // Filtrage basé sur le rôle de l'utilisateur actuel
    switch (this.currentUser.role) {

      case Role.SUPER_ADMIN:
        filtered = filtered.filter(user => user.role === Role.ADMIN || user.role === Role.RESIDENCE_MANAGER);
        break;
      case Role.ADMIN:
        filtered = filtered.filter(user => user.role === Role.RESIDENCE_MANAGER);
        break;
      case Role.RESIDENCE_MANAGER:
        filtered = filtered.filter(user => user.role === Role.RESIDENT || user.role === Role.SUB_RESIDENCE_MANAGER);
        break;
      case Role.SUB_RESIDENCE_MANAGER:
        filtered = filtered.filter(user => user.role === Role.RESIDENT);
        break;
      default:
        filtered = [];
    }

    if (!this.selectedRole) {
      return filtered;
    }

    return filtered.filter(user => user.role === this.selectedRole);

  }

  setAvailableRoles(): void {
    const currentUserRole = this.currentUser?.role;

    if (!currentUserRole) {
      this.availableRoles = [];
      return;
    }

    switch (currentUserRole) {
      case Role.SUPER_ADMIN:
        this.availableRoles = [Role.ADMIN, Role.RESIDENCE_MANAGER];
        break;
      case Role.ADMIN:
        this.availableRoles = [Role.RESIDENCE_MANAGER];
        break;
      case Role.RESIDENCE_MANAGER:
        this.availableRoles = [Role.SUB_RESIDENCE_MANAGER, Role.RESIDENT];
        break;
      case Role.SUB_RESIDENCE_MANAGER:
        this.availableRoles = [Role.RESIDENT];
        break;
      default:
        this.availableRoles = [];
    }
  }

  setupRealTimeSearch(): void {
    this.searchTerms.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((term) => {
      this.searchTerm = term;
      this.currentPage = 0;
      this.loadUsers();
    });

    this.roleSelections.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged()
    ).subscribe((role) => {
      this.selectedRole = role;
      this.currentPage = 0;
      this.loadUsers();
    });
  }

  onSearchChange(term: string): void {
    this.searchTerms.next(term);
  }

  onRoleChange(role: string | null): void {
    // Si "All Roles" est sélectionné, ne pas appliquer de filtre de rôle
    const selectedRole = role && role !== "All Roles" ? (role as Role) : null;
    this.roleSelections.next(selectedRole);
  }


  loadUsers(): void {
    if (!this.currentUser?.role) return;

    const request: UserSearchRequest = {
      searchTerm: this.searchTerm,
      page: this.currentPage,
      size: this.pageSize,
      role: this.selectedRole,
    };

    this.store.dispatch(UserActions.loadUsers({ request }));
  }

  nextPage(): void {
    this.currentPage++;
    this.loadUsers();
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  toggleUserStatus(userId: string): void {
    this.store.dispatch(UserActions.toggleUserStatus({ userId }));
  }

  deleteUser(userId: string): void {
    if (confirm("Are you sure you want to delete this user?")) {
      this.store.dispatch(UserActions.deleteUser({ userId }));
    }
  }

  canCreateUser(): boolean {
    return this.authService.hasRole([Role.SUPER_ADMIN, Role.ADMIN, Role.RESIDENCE_MANAGER, Role.SUB_RESIDENCE_MANAGER]);
  }


  canToggleUserStatus(): boolean {
    return this.authService.hasRole([Role.SUPER_ADMIN, Role.ADMIN]);
  }

  canDeleteUser(): boolean {
    return this.authService.hasRole([Role.SUPER_ADMIN]);
  }
}