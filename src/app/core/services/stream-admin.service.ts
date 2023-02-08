import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";

import { interval } from "rxjs/observable/interval";
import { from } from "rxjs/observable/from";
import { switchMap, takeWhile, tap, finalize } from "rxjs/operators";

import { Observable, BehaviorSubject } from "rxjs";

@Injectable()
export class StreamAdminService {
  status$ = new BehaviorSubject({});

  streamType = "g6-standard-16";
  idleType = "g6-nanode-1";
  POLLING_INTERVAL = 5000;
  STATE;
  ACTION;

  constructor(private http: Http) {}

  get serverIsModified() {
    if (this.ACTION) {
      if (this.ACTION === "on") {
        return this.STATE.type === this.streamType;
      } else if (this.ACTION === "off") {
        return this.STATE.type === this.idleType;
      }
    }
    return false;
  }

  poll(fetchFn, isSuccessFn, pollInterval = this.POLLING_INTERVAL) {
    return interval(this.POLLING_INTERVAL).pipe(
      switchMap(() => from(fetchFn)),
      takeWhile(response => isSuccessFn(response))
    );
  }

  watchServerInfo() {
    const headers = this.createAuthHeader();
    const options = {
      headers: headers
    };

    this.poll(this.http.get("https://admin.pulpmx.com/streamadmin", options), info => info)
      .pipe(
        tap((res: Response) => {
          const info = res.json();
          this.STATE = info;
          this.status$.next(info);
        }),
        takeWhile((res: Response) => {
          const info = res.json();
          return info["status"] !== "running" && !this.serverIsModified;
        }),
        finalize(() => {
          this.STATE = null;
          this.ACTION = null;
        })
      )
      .subscribe();
  }

  getStreamServerInfo() {
    const headers = this.createAuthHeader();
    const options = {
      headers: headers
    };

    return this.http
      .get("https://admin.pulpmx.com/streamadmin", options)
      .toPromise()
      .then(res => res.json());
  }

  serverOn(data) {
    this.ACTION = "on";
    const headers = this.createAuthHeader();
    const options = {
      headers: headers
    };

    return this.http
      .post("https://admin.pulpmx.com/streamadmin/on", data, options)
      .toPromise()
      .then(res => res.json());
  }

  serverOff(data) {
    this.ACTION = "on";
    const headers = this.createAuthHeader();
    const options = {
      headers: headers
    };

    return this.http
      .post("https://admin.pulpmx.com/streamadmin/off", data, options)
      .toPromise()
      .then(res => res.json());
  }

  createAuthHeader() {
    let headers = new Headers();
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      headers.set("Authorization", `${user}`);
      return headers;
    }
    return;
  }
}
