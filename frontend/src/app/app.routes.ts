import { Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component"
import { authGuard } from "./guards/auth.guard"
import { LandingComponent } from './components/landing-page/landing.component';

export const routes: Routes = [
    { path: "login", component: LoginComponent },
    { path: "landing", component: LandingComponent }, // Ajout de la route pour la landing page
    {
      path: "",
      redirectTo: "/landing", // Redirection vers la landing page au lieu du dashboard
      pathMatch: "full",
    },

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
      path: "reset-password",
      loadComponent: () =>
        import("./components/reset-password/reset-password.component").then((m) => m.ResetPasswordComponent),
    },
    { path: "**", redirectTo: "/login" },
];
