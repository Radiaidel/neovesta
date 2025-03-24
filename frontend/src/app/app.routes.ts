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
    canActivate: [authGuard]
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
    canActivate: [authGuard]
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
  {
    path: "features",
    loadComponent: () =>
      import("./components/feature/feature-list/feature-list.component").then((m) => m.FeatureListComponent),
    canActivate: [authGuard]
  },
  {
    path: "features/new",
    loadComponent: () =>
      import("./components/feature/feature-form/feature-form.component").then((m) => m.FeatureFormComponent),
    canActivate: [authGuard]
  },
  {
    path: "features/:id",
    loadComponent: () =>
      import("./components/feature/feature-detail/feature-detail.component").then((m) => m.FeatureDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: "features/:id/edit",
    loadComponent: () =>
      import("./components/feature/feature-form/feature-form.component").then((m) => m.FeatureFormComponent),
    canActivate: [authGuard]
  },
  {
    path: "reservations",
    loadComponent: () =>
      import("./components/reservation/reservation-list/reservation-list.component").then(
        (m) => m.ReservationListComponent,
      ),
      canActivate: [authGuard]
    },
  {
    path: "reservations/new",
    loadComponent: () =>
      import("./components/reservation/reservation-form/reservation-form.component").then(
        (m) => m.ReservationFormComponent,
      ),
      canActivate: [authGuard]
    },
  {
    path: "reservations/:id",
    loadComponent: () =>
      import("./components/reservation/reservation-detail/reservation-detail.component").then(
        (m) => m.ReservationDetailComponent,
      ),
      canActivate: [authGuard]
    },
  {
    path: "reservations/:id/edit",
    loadComponent: () =>
      import("./components/reservation/reservation-form/reservation-form.component").then(
        (m) => m.ReservationFormComponent,
      ),
      canActivate: [authGuard]
    },
  {
    path: "my-reservations",
    loadComponent: () =>
      import("./components/reservation/my-reservations/my-reservations.component").then(
        (m) => m.MyReservationsComponent,
      ),
      canActivate: [authGuard]
    },
  {
    path: "subscriptions",
    loadComponent: () =>
      import("./components/subscription/subscription-list/subscription-list.component").then(
        (m) => m.SubscriptionListComponent,
      ),
      canActivate: [authGuard]
    },
  {
    path: "subscriptions/new",
    loadComponent: () =>
      import("./components/subscription/subscription-form/subscription-form.component").then(
        (m) => m.SubscriptionFormComponent,
      ),
      canActivate: [authGuard]
    },
  {
    path: "subscriptions/:id",
    loadComponent: () =>
      import("./components/subscription/subscription-detail/subscription-detail.component").then(
        (m) => m.SubscriptionDetailComponent,
      ),
      canActivate: [authGuard]
    },
  {
    path: "subscriptions/:id/edit",
    loadComponent: () =>
      import("./components/subscription/subscription-form/subscription-form.component").then(
        (m) => m.SubscriptionFormComponent,
      ),
      canActivate: [authGuard]
    },
  {
    path: "profile",
    loadComponent: () => import("./components/profile/profile.component").then((m) => m.ProfileComponent),
    canActivate: [authGuard]
  },
  // {
  //   path: "profile",
  //   loadComponent: () => import("./components/profile/profile.component").then((m) => m.ProfileComponent),
  //   canActivate: [authGuard],
  //   children: [
  //     { path: "", redirectTo: "info", pathMatch: "full" },
  //     {
  //       path: "info",
  //       loadComponent: () =>
  //         import("../../../testbyzegrfyblzeb/profile-info/profile-info.component").then((m) => m.ProfileInfoComponent),
  //     },
  //     {
  //       path: "password",
  //       loadComponent: () =>
  //         import("../../../testbyzegrfyblzeb/profile-password/profile-password.component").then((m) => m.ProfilePasswordComponent),
  //     },
  //     {
  //       path: "delete",
  //       loadComponent: () =>
  //         import("../../../testbyzegrfyblzeb/profile-delete/profile-delete.component").then((m) => m.ProfileDeleteComponent),
  //     },
  //     {
  //       path: "residence",
  //       loadComponent: () =>
  //         import("../../../testbyzegrfyblzeb/residence-info/residence-info.component").then((m) => m.ResidenceInfoComponent),
  //       canActivate: [roleGuard],
  //       data: {
  //         roles: [Role.RESIDENCE_MANAGER, Role.SUB_RESIDENCE_MANAGER],
  //       },
  //     },
  //   ],
  // },
  {
    path: "**",
    loadComponent: () => import("./components/shared/not-found/not-found.component").then((m) => m.NotFoundComponent),
  },

];
