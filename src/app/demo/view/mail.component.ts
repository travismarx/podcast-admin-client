import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";
import { MailService } from "../service/mailservice";

import * as moment from "moment";

@Component({
  templateUrl: "./mail.component.html"
})
export class Mail {
  @ViewChild("activeTable") activeTable: ElementRef;
  @ViewChild("inactiveTable") inactiveTable: ElementRef;

  infoMsgs = [];
  loading;
  podcastInfo;
  sponsors;
  editingEpisodeData;
  mailLists;
  mailListData = {};
  selectedMailList;
  newRecipient = {
    address: {
      email: null,
      name: null
    }
  };

  constructor(
    private mailService: MailService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.mailService.getList().then(res => {
      let mailListOptions = [];
      res.forEach(i => {
        mailListOptions.push(
          Object.assign({}, {
            label: i['name'],
            value: i['id']
          })
        );
      });
      this.mailLists = mailListOptions;
      this.loading = false;
    });
  }

  getListData() {
    this.loading = true;
    const config = {
      params: {
        id: this.selectedMailList
      }
    };
    this.mailService.getList(config).then(res => {
      this.mailListData = res;
      this.loading = false;
    });
  }

  removeFromMailList(episode, idx) {
    this.mailListData["recipients"].splice(idx, 1);
    this.mailListData["recipients"] = this.mailListData["recipients"];
    this.activeTable["value"] = this.mailListData["recipients"];
  }

  saveMailList() {
    this.infoMsgs.push({
      severity: "info",
      detail: "Saving mailing list, please wait for confirmation"
    });
    this.mailService.updateMailList(this.mailListData).then(res => {
      if (res["statusCode"] === 200) {
        this.infoMsgs = [];
        this.infoMsgs.push({
          severity: "success",
          detail: "Mailing list saved successfully"
        });
        setTimeout(() => (this.infoMsgs = []), 5000);
      }
    });
  }

  addNewRecipient() {
    this.mailListData["recipients"].unshift(this.newRecipient);
    this.activeTable["value"] = this.mailListData["recipients"];
    this.newRecipient = {
      address: {
        email: null,
        name: null
      }
    };
  }
}
