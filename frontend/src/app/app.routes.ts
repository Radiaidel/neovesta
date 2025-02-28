import { Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component"
import { authGuard } from "./guards/auth.guard"
import { LandingComponent } from './components/landing-page/landing.component';
import { Role } from './models/user.model';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
    { path: "login", component: LoginComponent },
    { path: "", component: LandingComponent },
    {
        path: "dashboard",
        loadComponent: () => import("./components/dashboard/dashboard.component").then((m) => m.DashboardComponent),
        canActivate: [authGuard],
    },
    {
        path: "forgot-password",
        loadComponent: () =>
            import("./components/forgot-password/forgot-password.component").then((m) => m.ForgotPasswordComponent),
    },

    {
        path: "users",
        loadComponent: () => import("./components/user/user-list/user-list.component").then((m) => m.UserListComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.RESIDENCE_MANAGER, Role.SUB_RESIDENCE_MANAGER] },
      },
      {
        path: "users/create",
        loadComponent: () => import("./components/user/user-create/user-create.component").then((m) => m.UserCreateComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.RESIDENCE_MANAGER, Role.SUB_RESIDENCE_MANAGER] },
      },
      {
        path: "users/:id",
        loadComponent: () =>
          import("./components/user/user-details/user-details.component").then((m) => m.UserDetailsComponent),
        canActivate: [authGuard],
      },
      {
        path: "users/:id/edit",
        loadComponent: () => import("./components/user/user-edit/user-edit.component").then((m) => m.UserEditComponent),
        canActivate: [authGuard],
      },
      {
        path: "**",
        loadComponent: () => import("./components/shared/not-found/not-found.component").then((m) => m.NotFoundComponent),
      },

];
