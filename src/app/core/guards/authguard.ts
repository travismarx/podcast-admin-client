import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/authservice";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate() {
    return this.authService
      .isLoggedIn()
      .then(res => {
        if (!res.ok) {
          this.router.navigate(["/login"]);
        } else {
          return true;
        }
      })
      .catch(err => {
        console.log(err, "error in auth guard");
        return false;
      });
  }
}
