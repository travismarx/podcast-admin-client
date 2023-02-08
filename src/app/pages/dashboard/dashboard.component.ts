import { Component, OnInit } from "@angular/core";
import { EventService, Constants, StreamAdminService } from "../../core";
import * as moment from "moment";
import { LiveEvent, EmptyEvent } from "./models";
import { SelectItem } from "primeng/primeng";

@Component({
  templateUrl: "./dashboard.component.html"
})
export class DashboardComponent implements OnInit {
  liveShows;

  chartData: any;

  events: any[];

  selectedCity: any;

  raffleStats: any;

  addingToSchedule = false;

  showTitleOptions = Constants.showTitleOptions;

  newLiveEvent;

  streamServerInfo = null;

  modifyingServer = false;

  refreshInterval;

  waitServerResponse = true;

  constructor(private eventService: EventService, private streamAdmin: StreamAdminService) {}

  ngOnInit() {
    this.eventService.getLiveShowSchedule().then(schedule => {
      this.liveShows = schedule;
    });
    this.streamAdmin.getStreamServerInfo().then(res => {
      if (res.status === "resizing" || res.status === "booting") this.streamAdmin.watchServerInfo();
      this.streamServerInfo = res;
      this.waitServerResponse = false;
    });

    this.streamAdmin.status$.subscribe(data => {
      this.streamServerInfo = data;
      if (data["status"] === "running" || data["status"] === "offline")
        this.modifyingServer = false;
    });
    // this.eventService.getRaffleCount().then(res => {
    //   this.raffleStats = res;
    // });
  }

  addShowToSchedule(e) {
    this.addingToSchedule = true;
    const dayOfWeek = parseInt(e.date.format("d"));
    const date = e.date.format("YYYY-MM-DD");

    switch (dayOfWeek) {
      case 1:
        this.newLiveEvent = new LiveEvent("pulpmx", date);
        break;

      case 4:
        this.newLiveEvent = new LiveEvent("moto60", date);
        break;

      default:
        this.newLiveEvent = new EmptyEvent(date);
        break;
    }
  }

  handleEventClicked(e) {}

  saveNewLiveEvent() {
    this.newLiveEvent.unix = Number(
      moment(`${this.newLiveEvent.start} ${this.newLiveEvent.showtime}`, "YYYY-MM-DD HH:mm")
        .utcOffset("-08:00")
        .format("X")
    );
    this.liveShows.push(this.newLiveEvent);
    this.eventService.saveLiveSchedule(this.liveShows);

    this.addingToSchedule = false;
    this.newLiveEvent = {};
  }

  turnServerOn() {
    this.waitServerResponse = true;
    this.streamAdmin.serverOn({ setState: "on" }).then(res => {
      this.waitServerResponse = false;
      this.modifyingServer = true;
      this.streamAdmin.watchServerInfo();
    });
  }

  turnServerOff() {
    this.streamAdmin.serverOff({ setState: "off" }).then(res => {
      this.waitServerResponse = false;
      this.modifyingServer = true;
      this.streamAdmin.watchServerInfo();
    });
  }

  checkServerStatus(callback) {
    return this.streamAdmin.getStreamServerInfo().then(res => {
      return callback(res);
    });
  }

  get isStreamReady() {
    if (this.streamServerInfo) {
      const serverInfo = this.streamServerInfo;
      return serverInfo.status === "running" && serverInfo.type === "g6-standard-16";
      // serverInfo.status === "resizing" ||
      // serverInfo.status === "booting" ||
    }
    return false;
  }

  get isResizing() {
    if (this.streamServerInfo) {
      return (
        this.streamServerInfo.status === "resizing" ||
        this.streamServerInfo.status === "booting" ||
        this.modifyingServer
      );
    }

    return false;
  }
}
