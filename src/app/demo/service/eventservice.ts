import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";

@Injectable()
export class EventService {
  constructor(private http: Http) {}

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
    return this.http.get("https://api.pulpmx.com/appinfo/liveSchedule").toPromise().then(res => {
      console.log(res, "res for live schedule");
      return res.json().schedule;
    });
  }

  saveLiveSchedule(val) {
    return this.http
      .post("https://api.pulpmx.com/appinfo/liveSchedule", val)
      .toPromise()
      .then(res => {
        console.log(res, "res for live schedule post");
        return res.json().schedule;
      });
  }

  getInfoDoc(type) {
    return this.http.get(`https://api.pulpmx.com/appinfo/${type}`).toPromise().then(res => {
      console.log(res, "res for info item get");
      return res.json()[type];
    });
  }
}
