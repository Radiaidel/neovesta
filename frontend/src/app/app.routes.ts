import { Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component"
import { authGuard } from "./guards/auth.guard"
import { LandingComponent } from './components/landing-page/landing.component';

export const routes: Routes = [
    { path: "login", component: LoginComponent },
    { path: "neovesta", component: LandingComponent },
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
        path: "**",
        redirectTo: "/neovesta",
        pathMatch: "full",
    },

];
