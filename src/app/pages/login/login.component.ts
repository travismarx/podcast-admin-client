import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Http, RequestOptions } from "@angular/http";
import { UserService } from "../../core";

@Component({
  templateUrl: "./login.component.html"
})
export class LoginComponent {
  public form: FormGroup;

  public showError = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: Http,
    private user: UserService
  ) {
    this.form = fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  submitLogin(form) {
    this.showError = false;

    return this.http
      .post("https://admin.pulpmx.com/login", form)
      .toPromise()
      .then(res => {
        const response = res.json();
        this.user.set("user", response);
        this.router.navigate([""]);
      })
      .catch(err => {
        console.log(err, "err on sign in");
        this.showError = true;
      });
  }
}
