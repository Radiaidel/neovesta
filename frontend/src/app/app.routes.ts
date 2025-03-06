import { Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component"
import { authGuard } from "./guards/auth.guard"
import { LandingComponent } from './components/landing-page/landing.component';
import { Role } from './models/user.model';
import { roleGuard } from './guards/role.guard';
import { ContractRequiredGuard } from './guards/contract-required.guard';

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
    path: "residences",
    loadComponent: () =>
      import("./components/residence/residence-list/residence-list.component").then((m) => m.ResidenceListComponent),
  },
  {
    path: "residences/new",
    loadComponent: () =>
      import("./components/residence/residence-form/residence-form.component").then((m) => m.ResidenceFormComponent),
    canActivate: [authGuard]
  },
  {
    path: "residences/:id",
    loadComponent: () =>
      import("./components/residence/residence-detail/residence-detail.component").then(
        (m) => m.ResidenceDetailComponent,
      ),
      canActivate: [authGuard]
    },
  {
    path: "residences/:id/edit",
    loadComponent: () =>
      import("./components/residence/residence-form/residence-form.component").then((m) => m.ResidenceFormComponent),
    canActivate: [authGuard]
  },
  {
    path: "contracts",
    loadComponent: () =>
      import("./components/contract/contract-list/contract-list.component").then((m) => m.ContractListComponent),
    canActivate: [authGuard]
  },
  {
    path: "contracts/new",
    loadComponent: () =>
      import("./components/contract/contract-form/contract-form.component").then((m) => m.ContractFormComponent ),
    canDeactivate: [ContractRequiredGuard],
    canActivate: [authGuard]
  },
  {
    path: "contracts/:id",
    loadComponent: () =>
      import("./components/contract/contract-detail/contract-detail.component").then((m) => m.ContractDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: "contracts/:id/edit",
    loadComponent: () =>
      import("./components/contract/contract-form/contract-form.component").then((m) => m.ContractFormComponent),
    canActivate: [authGuard]
  },
  // {
  //   path: "residences",
  //   loadComponent: () => import("./components/residence/residence-list/residence-list.component").then((m) => m.ResidenceListComponent),
  //   canActivate: [authGuard],
  // },
  // {
  //   path: "residences/create", loadComponent: () => import("./components/residence/residence-form/residence-form.component").then((m) => m.ResidenceFormComponent),
  //   canActivate: [authGuard],
  // },
  // {
  //   path: "residences/:id", loadComponent: () => import("./components/residence/residence-list/residence-list.component").then((m) => m.ResidenceListComponent),
  //   canActivate: [authGuard],
  // },
  // {
  //   path: "residences/:id/edit", loadComponent: () => import("./components/residence/residence-list/residence-list.component").then((m) => m.ResidenceListComponent),
  //   canActivate: [authGuard],
  // },
  {
    path: "**",
    loadComponent: () => import("./components/shared/not-found/not-found.component").then((m) => m.NotFoundComponent),
  },

];
