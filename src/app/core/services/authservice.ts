import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { UserService } from "../services";

@Injectable()
export class AuthService {
  constructor(private http: Http, private user: UserService) {}

  isLoggedIn() {
    const authObj = this.user.authObj();
    const options = new RequestOptions({});
    options.headers = this.createAuthHeader();


    return this.http
      .get("https://admin.pulpmx.com/auth", options)
      .toPromise()
      .then(res => {
        return res;
      })
      .catch(err => {
        return err;
      });
  }

  createAuthHeader() {
    let headers = new Headers();
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      headers.set(
        "Authorization",
        `${user}`
      );
      return headers;
    }
    return;
  }
}
