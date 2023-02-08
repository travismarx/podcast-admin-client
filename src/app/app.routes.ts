import { LoginComponent } from "./pages/login/login.component";
import { AppComponent } from "./app.component";
import { CanActivate, RouterModule, Routes } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { DashboardComponent } from "./pages/dashboard";
import { FeedsComponent } from "./pages/feeds";
import { SponsorsComponent } from "./pages/sponsors";
import { MailComponent } from "./pages/mail";
import { AuthGuard } from "./core/guards/authguard";
import { HomeComponent } from "./home.component";

export const routes: Routes = [
  {
    path: "",
    // component: HomeComponent,
    children: [
      { path: "login", component: LoginComponent },
      {
        path: "",
        component: AppComponent,
        canActivate: [AuthGuard],
        children: [
          { path: "", component: DashboardComponent},
          { path: "feeds/:show", component: FeedsComponent },
          { path: "sponsors", component: SponsorsComponent },
          { path: "mail", component: MailComponent }
        ]
      }
    ]
  }
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
