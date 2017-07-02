import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";
import { FeedService } from "../service/feedservice";
import { EpisodeDefaults } from "../../core/constants/episodeDefaults";
import { Constants } from "../../core/constants/constants";

import * as moment from "moment";

@Component({
  templateUrl: "./feeds.component.html"
})
export class Feeds {
  @ViewChild("activeTable") activeTable: ElementRef;
  @ViewChild("inactiveTable") inactiveTable: ElementRef;

  infoMsgs = [];
  podcastInfo;
  editingEpisodeData;

  private subscription;
  private originalEpisodeData;
  private podAbbr;
  private fileInfoError = [];
  private showGeneralInfo: boolean = false;
  private newEpisodeData = JSON.parse(JSON.stringify(EpisodeDefaults.emptyEpisode));
  private showCreateDialog = false;
  private steveDefaults = EpisodeDefaults.steveshowDefaults;
  private actionOptions = [
    {
      label: "Save Feed",
      icon: "fa-check",
      command: () => this.saveFeed()
    },
    {
      label: "Ping Feedburner",
      icon: "fa-external-link",
      command: () => this.pingFeedburner()
    },
    {
      label: "Edit Info",
      icon: "fa-pencil",
      command: e => (this.showGeneralInfo = true)
    }
  ];
  private editEpisodeOptions = [
    {
      label: "Save Episode & Feed",
      icon: "fa-save"
    }
  ];
  private newEpisodeBtnOptions = [
    {
      label: "Just add episode",
      icon: "fa-plus"
    }
  ];
  private episodeOptions = [
    {
      label: "Edit episode",
      icon: "fa-pencil"
    },
    {
      label: "Deactivate episode",
      icon: "fa-ban"
    }
  ];

  constructor(private router: Router, private route: ActivatedRoute, private service: FeedService) {
    this.subscription = router.events
      .filter(val => val instanceof NavigationEnd)
      .map(() => this.route)
      .subscribe(val => {
        let show = this.route.params["value"].id;
        this.podAbbr = show;
        this.getFeedData(show);
      });
  }

  getFeedData(show) {
    this.service.getXmlAsJson(show).then(res => {
      this.podcastInfo = res;
    });
  }

  audioUploadPrep(e) {
    e.xhr.send(`show=${this.podAbbr}`);
  }

  verifyUpload(e) {
    let file = e.files[0];
    if (e.xhr.status === 200) {
      this.fileInfoError.push({
        severity: "success",
        summary: "File successfully uploaded",
        detail: `"${file.name}" has been added to its proper folder.`
      });
      this.newEpisodeData.enclosure.attributes.url = file.name;
      this.newEpisodeData.enclosure.attributes.length = file.size.toLocaleString();

      setTimeout(() => {
        this.fileInfoError = [];
      }, 4000);
    }

    this.getAudioDuration(file.name);
  }

  createNewEpisode() {
    this.showCreateDialog = true;
    this.newEpisodeData.pubDate.textContent = moment().format("ddd, DD MMM YYYY HH:mm:ss ZZ");
    if (this.podAbbr !== "steveshow") {
      this.newEpisodeData.title.textContent = this.service.guessEpisodeNumber(
        this.podAbbr,
        this.newEpisodeData,
        this.podcastInfo.episodes[0]
      );
    }
  }

  saveNewEpisode() {
    const fileUrl = this.newEpisodeData.enclosure.attributes.url;
    const isInactive = this.newEpisodeData.isInactive;
    const newEpisodeDest = !isInactive
      ? this.podcastInfo.episodes
      : this.podcastInfo.inactiveEpisodes;

    this.newEpisodeData.enclosure.attributes.url =
      Constants.enclosure_prefix[this.podAbbr] + fileUrl;
    this.newEpisodeData.guid.textContent = fileUrl;
    this.newEpisodeData["itunes:summary"].textContent = this.newEpisodeData.description.textContent;

    newEpisodeDest.unshift(this.newEpisodeData);
    if (!isInactive) {
      this.podcastInfo.pubDate.textContent = this.newEpisodeData.pubDate.textContent;
    }
    setTimeout(() => {
      this.newEpisodeData = JSON.parse(JSON.stringify(EpisodeDefaults.emptyEpisode));
      this.showCreateDialog = false;
      this.activeTable["value"] = this.podcastInfo.episodes;
    });
  }

  addInactiveEpisode() {
    const fileUrl = this.newEpisodeData.enclosure.attributes.url + ".mp3";
    this.newEpisodeData.enclosure.attributes.url =
      Constants.enclosure_prefix[this.podAbbr] + fileUrl;
    this.newEpisodeData.guid.textContent = fileUrl;
    this.newEpisodeData["itunes:summary"].textContent = this.newEpisodeData.description.textContent;

    this.podcastInfo.inactiveEpisodes.unshift(this.newEpisodeData);
    setTimeout(() => {
      this.newEpisodeData = JSON.parse(JSON.stringify(EpisodeDefaults.emptyEpisode));
      this.showCreateDialog = false;
      this.inactiveTable["value"] = this.podcastInfo.inactiveEpisodes;
    });
  }

  newEpisodeSaveFeed() {
    this.saveNewEpisode();
    // setTimeout(() => this.saveFeed(), 1000);
    // this.saveFeed();
  }

  toggleEpisodeStatus(ep, idx, table) {
    const pubDate = moment().format("ddd, DD MMM YYYY HH:mm:ss ZZ");
    let src, dest;

    table === "inactive"
      ? ((src = "inactiveEpisodes"), (dest = "episodes"), (ep.pubDate.textContent = pubDate))
      : ((src = "episodes"), (dest = "inactiveEpisodes"));

    this.podcastInfo.pubDate.textContent = pubDate;
    this.podcastInfo[dest].unshift(ep);
    this.podcastInfo[src].splice(idx, 1);
    this.activeTable["value"] = this.podcastInfo.episodes;

    setTimeout(() => {
      if (this.podcastInfo.inactiveEpisodes.length)
        this.inactiveTable["value"] = this.podcastInfo.inactiveEpisodes;
    });
  }

  // deactivateEpisode(episode, idx) {
  //   console.log(episode, idx, "deactivating episode");
  //   this.podcastInfo.inactiveEpisodes.unshift(episode);
  //   this.podcastInfo.episodes.splice(idx, 1);
  //   this.activeTable["value"] = this.podcastInfo.episodes;
  //   setTimeout(() => {
  //     this.inactiveTable["value"] = this.podcastInfo.inactiveEpisodes;
  //   });
  // }

  // publishInactiveEpisode(episode, idx, table) {
  //   console.log(table, "table");
  //   this.podcastInfo.episodes.unshift(episode);
  //   this.podcastInfo.inactiveEpisodes.splice(idx, 1);
  //   this.activeTable["value"] = this.podcastInfo.episodes;
  //   this.inactiveTable["value"] = this.podcastInfo.inactiveEpisodes;
  // }

  changeSteveDefault(e) {
    const newDefault = e.value;
    this.newEpisodeData = JSON.parse(JSON.stringify(EpisodeDefaults.emptyEpisode));
    for (let i in EpisodeDefaults.steveshow[newDefault]) {
      let defaultProp = EpisodeDefaults.steveshow[newDefault][i];
      this.newEpisodeData[i].textContent = defaultProp;
    }
  }

  openEpisodeEditor(episode) {
    this.originalEpisodeData = JSON.parse(JSON.stringify(episode));
    this.editingEpisodeData = episode;
  }

  closeEpisodeEdit() {
    setTimeout(() => {
      this.editingEpisodeData = null;
      this.originalEpisodeData = null;
    });
  }

  saveFeed() {
    this.podcastInfo.pubDate.textContent = moment().format("ddd, DD MMM YYYY HH:mm:ss ZZ")
    this.infoMsgs.push({
      severity: "info",
      detail: "Saving feed, please wait for confirmation"
    });
    this.service.saveAndWriteXml(this.podcastInfo, this.podAbbr).then(res => {
      this.infoMsgs = [];
      this.infoMsgs.push({
        severity: "success",
        detail: "Feed saved successfully"
      });
      setTimeout(() => {
        this.infoMsgs = [];
      }, 5000);
    });
  }

  getFileSize() {
    if (!this.newEpisodeData.enclosure.attributes.url) return;

    const fileName = this.newEpisodeData.enclosure.attributes.url + ".mp3";
    this.service.getFileSize(fileName, this.podAbbr).then(res => {
      if (!res.message) {
        this.newEpisodeData.enclosure.attributes.length = res;
        let audioSrc = Constants.enclosure_prefix[this.podAbbr] + fileName;
        let ghost = document.getElementById("audioGhost").setAttribute("src", audioSrc);

        document.getElementById("audioGhost").onloadedmetadata = e => {
          const dur = e.target["duration"];
          let formatted = moment.utc(dur * 1000).format("H:mm:ss");
          this.newEpisodeData["itunes:duration"].textContent = formatted;
          e.target["setAttribute"]("src", null);
        };
      } else {
        this.fileInfoError.push({
          severity: "error",
          summary: "Something went wrong getting file size info",
          detail: `The error message received is: ${res.message}`
        });
        setTimeout(() => {
          this.fileInfoError = [];
        }, 15000);
      }
    });
  }

  getAudioDuration(fileName) {
    let audioSrc = Constants.enclosure_prefix[this.podAbbr] + fileName;
    let ghost = document.getElementById("audioGhost").setAttribute("src", audioSrc);

    document.getElementById("audioGhost").onloadedmetadata = e => {
      const dur = e.target["duration"];
      let formatted = moment.utc(dur * 1000).format("H:mm:ss");
      this.newEpisodeData["itunes:duration"].textContent = formatted;
      e.target["setAttribute"]("src", null);
    };
  }

  clearMessagesTimer(waitVal) {
    setTimeout(() => {
      this.infoMsgs = [];
    }, waitVal);
  }

  resetNewEpisode() {
    this.newEpisodeData = JSON.parse(JSON.stringify(EpisodeDefaults.emptyEpisode));
  }

  pingFeedburner() {
    window.open(Constants.showOptions[this.podAbbr].feedburner, "_blank");
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
