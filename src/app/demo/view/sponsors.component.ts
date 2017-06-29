import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";
import { FeedService } from "../service/feedservice";
import { EventService} from '../service/eventservice';
import { EpisodeDefaults } from "../../core/constants/episodeDefaults";
import { Constants } from "../../core/constants/constants";

import * as moment from "moment";

@Component({
  templateUrl: "./sponsors.component.html"
})
export class Sponsors {
  @ViewChild("activeTable") activeTable: ElementRef;
  @ViewChild("inactiveTable") inactiveTable: ElementRef;

  infoMsgs = [];
  podcastInfo;
  sponsors;
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
      icon: "fa-external-link"
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
      label: "Add Episode Only",
      icon: "fa-plus"
    },
    {
      label: "Add to inactive episodes",
      icon: "fa-ban",
      command: () => this.addInactiveEpisode()
    }
  ];

  constructor(private router: Router, private route: ActivatedRoute, private service: FeedService, private eventService: EventService) {
    this.subscription = router.events
      .filter(val => val instanceof NavigationEnd)
      .map(() => this.route)
      .subscribe(val => {
        let show = this.route.params["value"].id;
        this.podAbbr = show;
        this.getFeedData(show);
      });
  }

  ngOnInit() {
    this.eventService.getInfoDoc('sponsors').then(res => {
      this.sponsors = res;
    })
  }

  getFeedData(show) {
    this.service.getXmlAsJson(show).then(res => {
      this.podcastInfo = res;
    });
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
    const fileUrl = this.newEpisodeData.enclosure.attributes.url + ".mp3";
    this.newEpisodeData.enclosure.attributes.url =
      Constants.enclosure_prefix[this.podAbbr] + fileUrl;
    this.newEpisodeData.guid.textContent = fileUrl;
    this.newEpisodeData["itunes:summary"].textContent = this.newEpisodeData.description.textContent;

    // this.podcastInfo.episodes.unshift(this.newEpisodeData);
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
    setTimeout(() => this.saveFeed(), 2000);
    // this.saveFeed();
  }

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

  publishInactiveEpisode(episode, idx) {
    this.podcastInfo.episodes.unshift(episode);
    this.podcastInfo.inactiveEpisodes.splice(idx, 1);
    this.activeTable["value"] = this.podcastInfo.episodes;
    this.inactiveTable["value"] = this.podcastInfo.inactiveEpisodes;
  }

  saveFeed() {
    this.podcastInfo.pubDate.textContent = this.podcastInfo.episodes[0].pubDate.textContent;
    this.infoMsgs.push({
      severity: "info",
      detail: "Saving feed, please wait for confirmation"
    });
    this.service.saveAndWriteXml(this.podcastInfo, this.podAbbr);
    setTimeout(() => {
      this.infoMsgs = [];
      this.infoMsgs.push({
        severity: "success",
        detail: "Feed saved successfully"
      });
    }, 2000);
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

  clearMessagesTimer(waitVal) {
    setTimeout(() => {
      this.infoMsgs = [];
    }, waitVal);
  }

  resetNewEpisode() {
    console.log("reset new episode");
    this.newEpisodeData = JSON.parse(JSON.stringify(EpisodeDefaults.emptyEpisode));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
