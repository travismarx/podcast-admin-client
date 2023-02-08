import { AuthService } from "../../core/services/authservice";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";
import { FeedService, UserService, EpisodeDefaults, Constants } from "../../core";
import * as moment from "moment";

@Component({
  templateUrl: "./feeds.component.html"
})
export class FeedsComponent {
  @ViewChild("activeTable") activeTable: ElementRef;
  @ViewChild("inactiveTable") inactiveTable: ElementRef;

  infoMsgs = [];
  podcastInfo;
  editingEpisodeData;

  public subscription;
  public originalEpisodeData;
  public podAbbr;
  public fileInfoError = [];
  public showGeneralInfo: boolean = false;
  public newEpisodeData = JSON.parse(JSON.stringify(EpisodeDefaults.emptyEpisode));
  public showCreateDialog = false;
  public steveDefaults = EpisodeDefaults.steveshowDefaults;
  public actionOptions = [
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
  public editEpisodeOptions = [
    {
      label: "Save Episode & Feed",
      icon: "fa-save"
    }
  ];
  public newEpisodeBtnOptions = [
    {
      label: "Just add episode",
      icon: "fa-plus",
      command: () => this.saveNewEpisode()
    }
  ];
  public episodeOptions = Constants.episodeOptions;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: FeedService,
    private user: UserService,
    private auth: AuthService
  ) {
    this.subscription = this.route.url.subscribe(val => {
      const show = val[1].path;
      this.podAbbr = show;
      this.getFeedData(show);
    });
    // this.subscription = router.events
    // .filter(val => val instanceof NavigationEnd)
    // .map(() => this.route)
    // .subscribe(val => {
    //   // const show = val[1].path;
    //   // console.log(show, 'show');
    //   console.log(this.route.url['value'][1].path, 'route params');
    //     // let show = this.route.params["value"].id;
    //     // this.podAbbr = show;
    //     // this.getFeedData(show);
    //   });
  }

  preUploadOp(e) {
    const user = JSON.parse(localStorage.getItem("user"));
    e.xhr.setRequestHeader("Authorization", user);
  }

  getFeedData(show) {
    this.service.getXmlAsJson(show).then(res => {
      this.podcastInfo = res.data;
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
      this.newEpisodeData.pubDate.textContent = moment().format("ddd, DD MMM YYYY HH:mm:ss ZZ");

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
    let newEpData = this.newEpisodeData;
    const fileUrl = newEpData.enclosure.attributes.url.replace(/ /, "");
    const isInactive = newEpData.isInactive;
    const newEpisodeDest = !isInactive
      ? this.podcastInfo.episodes
      : this.podcastInfo.inactiveEpisodes;

    newEpData.enclosure.attributes.url = Constants.enclosure_prefix[this.podAbbr] + fileUrl;
    newEpData.guid.textContent = fileUrl;
    newEpData["itunes:summary"].textContent = newEpData.description.textContent;

    newEpisodeDest.unshift(newEpData);
    if (!isInactive) {
      this.podcastInfo.pubDate.textContent = newEpData.pubDate.textContent;
    }
    setTimeout(() => {
      newEpData = JSON.parse(JSON.stringify(EpisodeDefaults.emptyEpisode));
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
    setTimeout(() => this.saveFeed(), 1000);
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

  deleteEpisode(ep, idx, table) {
    let src, dest;

    table === "inactive"
      ? ((src = "inactiveEpisodes"), (dest = "episodes"))
      : ((src = "episodes"), (dest = "inactiveEpisodes"));

    this.podcastInfo[src].splice(idx, 1);
    this.activeTable["value"] = this.podcastInfo.episodes;

    setTimeout(() => {
      if (this.podcastInfo.inactiveEpisodes.length)
        this.inactiveTable["value"] = this.podcastInfo.inactiveEpisodes;
    });
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

  saveFeed() {
    this.podcastInfo.pubDate.textContent = moment().format("ddd, DD MMM YYYY HH:mm:ss ZZ");
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
    let enclosureAttrs = this.newEpisodeData.enclosure.attributes;
    if (!enclosureAttrs.url || enclosureAttrs.length) return;

    let fileName = enclosureAttrs.url;
    let len = fileName.length;
    if (fileName.slice(len - 4, len) !== ".mp3") fileName = fileName + ".mp3";

    this.service.getFileSize(fileName, this.podAbbr).then(res => {
      if (!res.message) {
        enclosureAttrs.length = res;
        this.getAudioDuration(fileName);
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

  closeEpisodeEdit() {
    setTimeout(() => {
      this.editingEpisodeData = null;
      this.originalEpisodeData = null;
    });
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
