import { Component, OnInit } from "@angular/core";
import { CarService } from "../service/carservice";
import { EventService } from "../service/eventservice";
import { Car } from "../domain/car";
import { SelectItem } from "primeng/primeng";

import * as moment from "moment";

@Component({
  templateUrl: "./dashboard.html"
})
export class DashboardDemo implements OnInit {
  cities: SelectItem[];

  cars: Car[];

  liveShows;

  chartData: any;

  events: any[];

  selectedCity: any;

  addingToSchedule = false;

  showTitleOptions = [
    {
      label: "The PulpMX Show",
      value: "pulpmx"
    },
    {
      label: "Fly Moto:60 Show",
      value: "moto60"
    }
  ];

  newLiveEvent = {
    epPodTitleAbbr: null,
    showtime: null,
    epPodAbbr: null,
    epPodTitle: null,
    guests: null,
    epDescription: null,
    title: null,
    start: null,
    unix: null,
    epPodImage: null
  };

  constructor(private carService: CarService, private eventService: EventService) {}

  ngOnInit() {
    this.eventService.getLiveShowSchedule().then(schedule => {
      this.liveShows = schedule;
    });
  }

  addShowToSchedule(e) {
    this.addingToSchedule = true;
    let dayOfWeek = e.date.format("d");
    this.newLiveEvent.start = e.date.format("YYYY-MM-DD");

    if (dayOfWeek == 1) {
      this.newLiveEvent.epPodTitleAbbr = "pulpmx";
      this.newLiveEvent.epPodAbbr = "pulpmx";
      this.newLiveEvent.showtime = "18:00";
      this.newLiveEvent.title = this.showTitleOptions[0].label;
      (this.newLiveEvent.epPodImage = "img/showthumbs/pulpmx.png"), (this.newLiveEvent.epPodTitle =
        "The PulpMX Show Presented by BTOSports.com and Fly Racing");
    } else if (dayOfWeek == 4) {
      this.newLiveEvent.title = this.showTitleOptions[1].label;
      this.newLiveEvent.epPodTitleAbbr = "moto60";
      this.newLiveEvent.epPodAbbr = "moto60";
      this.newLiveEvent.showtime = "12:00";
      this.newLiveEvent.guests = "The usuals";
      (this.newLiveEvent.epPodImage = "img/showthumbs/moto60.png"), (this.newLiveEvent.epPodTitle =
        "The Fly Racing Moto:60 Show Presented by Truck Hero, Pro Taper, and GET Data");
    }
  }

  handleEventClicked(e) {
  }

  saveNewLiveEvent() {
    this.newLiveEvent.unix = Number(
      moment(`${this.newLiveEvent.start} ${this.newLiveEvent.showtime}`, "YYYY-MM-DD HH:mm")
        .utcOffset("-08:00")
        .format("X")
    );
    this.liveShows.push(this.newLiveEvent);
    this.eventService.saveLiveSchedule(this.liveShows)

    this.addingToSchedule = false;
    this.newLiveEvent = {
      epPodTitleAbbr: null,
      showtime: null,
      epPodAbbr: null,
      epPodTitle: null,
      guests: null,
      epDescription: null,
      title: null,
      start: null,
      unix: null,
      epPodImage: null
    };
  }
}
