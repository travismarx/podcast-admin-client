import { Injectable } from "@angular/core";
import { Constants } from "../../../core";

@Injectable()
export class LiveEvent {
  epPodTitleAbbr;
  showtime;
  epPodAbbr;
  epPodTitle;
  guests;
  epDescription;
  title;
  start;
  unix;
  epPodImage;

  constructor(showAbbr: string, date: any) {
    for (let i in Constants.liveEventDefaults[showAbbr]) {
      this[i] = Constants.liveEventDefaults[showAbbr][i];
    }
    this.start = date;
  }
}

export class EmptyEvent {
  epPodTitleAbbr;
  showtime;
  epPodAbbr;
  epPodTitle;
  guests;
  epDescription;
  title;
  start;
  unix;
  epPodImage;
  constructor(date: any) {
    this.epPodTitleAbbr = null;
    this.showtime = null;
    this.epPodAbbr = null;
    this.epPodTitle = null;
    this.guests = null;
    this.epDescription = null;
    this.title = null;
    this.start = date;
    this.unix = null;
    this.epPodImage = null;
  }
}
