import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import * as moment from "moment";

import { EpisodeDefaults } from "../../core/constants/episodeDefaults";
import { Constants } from "../../core/constants/constants";

@Injectable()
export class FeedService {
  constructor(private http: Http) {}

  getXmlAsJson(show) {
    return this.http
      .get(`https://api.pulpmx.com/xmlfeed/${show}`)
      .toPromise()
      .then(res => res.json());
  }

  saveAndWriteXml(podcastInfo, show) {
    console.log(show, "show");
    podcastInfo.lastModified = moment().format("x");
    const config = {
      params: {
        type: "feed",
        show: show,
        xmlName: Constants.showOptions[show].xmlName
      }
    };

    return this.http
      .post(`https://api.pulpmx.com/xmlfeed/${show}`, podcastInfo, config)
      .toPromise()
      .then(res => {
        // console.log(res.json(), "save xml res");
        this.http
          .post(`https://admin.pulpmx.com/saveXml`, podcastInfo, config)
          .toPromise()
          .then(res => {
            console.log(res, "written xml res");
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
    let showNum = previous.title.textContent.match(re);
    showNum = Number(showNum) + 1;

    if (show === "pulpmx" || show === "keefer") {
      episode.title.textContent = episode.title.textContent + showNum + " - ";
    } else if (show === "hockey") {
      episode.title.textContent = episode.title.textContent + showNum + ": ";
    } else {
      episode.title.textContent =
        episode.title.textContent + showNum + " - Race " + moment().format("YYYY");
    }
    return episode.title.textContent;
  }
}
