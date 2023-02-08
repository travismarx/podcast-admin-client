import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import * as moment from "moment";

import { EpisodeDefaults } from "../../core/constants/episodeDefaults";
import { Constants, UserService } from "../../core";
import { AuthService } from "./authservice";

@Injectable()
export class FeedService {
  constructor(private http: Http) {}

  getXmlAsJson(show) {
    const headers = this.createAuthHeader();
    const options = {
      headers: headers
    };
    return this.http
      .get(`https://admin.pulpmx.com/xmlfeed/${show}`, options)
      .toPromise()
      .then(res => res.json());
  }

  saveAndWriteXml(podcastInfo, show) {
    podcastInfo.lastModified = moment().format("x");

    const headers = this.createAuthHeader();
    const config = {
      params: {
        show: show,
        xmlName: Constants.showOptions[show].xmlName
      },
      headers: headers
    };

    return this.http
      .post(`https://admin.pulpmx.com/xmlfeed/${show}`, podcastInfo, config)
      .toPromise()
      .then(res => {
        // console.log(res.json(), "save xml res");
        this.http
          .post(`https://admin.pulpmx.com/saveXml`, podcastInfo, config)
          .toPromise()
          .then(res => {
            return res;
          });
      });
  }

  getFileSize(fileName, show) {
    const config = {
      params: {
        fileName: fileName,
        show: show
      }
    };

    return this.http
      .get("https://admin.pulpmx.com/fileInfo", config)
      .toPromise()
      .then(
        res => {
          return res.json().size.toLocaleString();
        },
        err => {
          return err.json();
        }
      )
      .catch(err => err);
  }

  guessEpisodeNumber(show, episode, previous) {
    episode.title.textContent = EpisodeDefaults[show].title;
    if (EpisodeDefaults[show].description) {
      episode.description.textContent = EpisodeDefaults[show].description;
    }
    let re = /\d+/;
    let showNum = previous ? previous.title.textContent.match(re) : null;
    showNum = Number(showNum) + 1;

    if (show === "pulpmx" || show === "keefer") {
      episode.title.textContent = episode.title.textContent + showNum + " - ";
    } else if (show === "hockey") {
      episode.title.textContent = episode.title.textContent + showNum + ": ";
    } else if (show === "shiftinggears" || show === "industryseating") {
      episode.title.textContent = episode.title.textContent;
    } else {
      episode.title.textContent =
        episode.title.textContent +
        showNum +
        " - Race " +
        moment().format("YYYY");
    }
    return episode.title.textContent;
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
