import { Inject, Injectable, PACKAGE_ROOT_URL } from "@angular/core";
import { Router } from "@angular/router";

interface AuthObj {
  username: string;
  accessToken: string;
}

@Injectable()
export class UserService {
  public state;

  constructor(public router: Router) {
    this.state = {
      username: null,
      accessToken: null,
      showId: null,
    };
  }

  public set(key, val) {
    return localStorage.setItem(key, JSON.stringify(val));
  }

  public get(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  public setKeys(keys: any) {
    for (let key in keys) {
      let val = keys[key];
      localStorage.setItem(key, JSON.stringify(val));
    }
  }

  public getKeys(keys: string[]) {
    let obj = {};
    keys.map((key) => {
      if (localStorage.getItem(key) !== "undefined") {
        Object.assign(obj, {
          [key]: JSON.parse(localStorage.getItem(key)),
        });
      }
    });
    return obj;
  }

  public authObj(): AuthObj {
    return new AuthObj();
  }

  public clear() {
    return localStorage.clear();
  }

  public logout() {
    this.state = { username: null, accessToken: null };
    this.clear();
    this.router.navigate(["/login"]);
    // this.api.request("POST", "/logout").then(res => {
    //   this.clear();
    //   this.router.navigate(["/login"]);
    // });
  }
}

class AuthObj {
  constructor() {
    this.username = JSON.parse(localStorage.getItem("username"));
    this.accessToken = JSON.parse(localStorage.getItem("accessToken"));
  }
}
