import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";

@Injectable()
export class EventService {
  constructor(private http: Http) {}

  getStreamServerInfo() {
    console.log("Getting stream info");
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
    const headers = this.createAuthHeader();
    const options = {
      headers: headers,
    };

    return this.http
      .post("https://admin.pulpmx.com/streamadmin/on", data, options)
      .toPromise()
      .then(res => res.json());
  }

  serverOff(data) {
    const headers = this.createAuthHeader();
    const options = {
      headers: headers,
    };

    return this.http
      .post("https://admin.pulpmx.com/streamadmin/off", data, options)
      .toPromise()
      .then(res => res.json());
  }

  getRaffleCount() {
    return this.http
      .get("https://raffle.pulpmx.com/entries")
      .toPromise()
      .then(res => {
        return res.json();
      });
  }

  getEvents() {
    return this.http
      .get("assets/demo/data/scheduleevents.json")
      .toPromise()
      .then(res => <any[]>res.json().data)
      .then(data => {
        return data;
      });
  }

  getLiveShowSchedule() {
    return this.http
      .get("https://api.pulpmx.com/appinfo/liveSchedule")
      .toPromise()
      .then(res => {
        return res.json().schedule;
      });
  }

  saveLiveSchedule(val) {
    return this.http
      .post("https://api.pulpmx.com/appinfo/liveSchedule", val)
      .toPromise()
      .then(res => {
        return res.json().schedule;
      });
  }

  getInfoDoc(type) {
    return this.http
      .get(`https://api.pulpmx.com/appinfo/${type}`)
      .toPromise()
      .then(res => {
        return res.json()[type];
      });
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
