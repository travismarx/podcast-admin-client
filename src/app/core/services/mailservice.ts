import { Injectable } from "@angular/core";
import { Http, Headers, Response, Request, RequestMethod, RequestOptions } from "@angular/http";

@Injectable()
export class MailService {
  //   options = {};

  constructor(private http: Http) {}

  getList(options: any = {}) {
    const url = !options.params
      ? "https://api.pulpmx.com/mail/lists"
      : `https://api.pulpmx.com/mail/lists/${options.params.id}`;

    return this.http.get(url).toPromise().then(res => {
      return res.json().body.results;
    });
  }

  updateMailList(list) {
    const url = `https://api.pulpmx.com/mail/lists/${list.id}`;

    return this.http.put(url, list).toPromise().then(res => {
      return res.json();
    });
  }

  private createAuthHeader(headers: Headers) {
    headers.append("Authorization", "e21076d4c6f24942db1f4b8930366d03dcc6d432");
    return headers;
  }
}
