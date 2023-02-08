import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  EventEmitter,
  ViewChild,
  Inject,
  forwardRef,
} from "@angular/core";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { MenuItem } from "primeng/primeng";
import { AppComponent } from "./app.component";

@Component({
  selector: "app-menu",
  template: `
    <ul
      app-submenu
      [item]="model"
      root="false"
      class="navigation-menu"
      visible="true"
    ></ul>
  `,
})
export class AppMenuComponent implements OnInit {
  model: any[];

  constructor(
    @Inject(forwardRef(() => AppComponent))
    public app: AppComponent
  ) {}

  ngOnInit() {
    this.model = [
      // { label: "Dashboard", icon: "fa fa-fw fa-home", routerLink: ["/"] },
      // {
      // label: "Podcast Feeds",
      // icon: "fa fa-fw fa-rss",
      // items: [
      { label: "PulpMX Show", routerLink: ["/feeds/pulpmx"] },
      { label: "Steve Matthes Show", routerLink: ["/feeds/steveshow"] },
      { label: "Moto:60 Show", routerLink: ["/feeds/moto60"] },
      { label: "Pulp Hockey", routerLink: ["/feeds/hockey"] },
      { label: "Keefer Tested", routerLink: ["/feeds/keefer"] },
      { label: "Shifting Gears", routerLink: ["/feeds/shiftinggears"] },
      { label: "Industry Seating", routerLink: ["/feeds/industryseating"] },
      { label: "Re-Raceables", routerLink: ["/feeds/reraceables"] },
      {
        label: "Coffee w/ the Keefers",
        routerLink: ["/feeds/coffeewithkeefers"],
      },

      // ]
      // },
      // { label: "Sponsors", icon: "fa fa-fw fa-money", routerLink: ["/sponsors"] },
    ];
  }

  changeTheme(theme) {
    this.app.theme = theme;
    let themeLink: HTMLLinkElement = <HTMLLinkElement>(
      document.getElementById("theme-css")
    );
    let layoutLink: HTMLLinkElement = <HTMLLinkElement>(
      document.getElementById("layout-css")
    );

    themeLink.href = "assets/theme/theme-" + theme + ".css";
    layoutLink.href = "assets/layout/css/layout-" + theme + ".css";
  }
}

@Component({
  selector: "[app-submenu]",
  template: `
    <ng-template
      ngFor
      let-child
      let-i="index"
      [ngForOf]="root ? item : item.items"
    >
      <li
        [ngClass]="{ 'active-menuitem': isActive(i) }"
        *ngIf="child.visible === false ? false : true"
      >
        <a
          [href]="child.url || '#'"
          (click)="itemClick($event, child, i)"
          *ngIf="!child.routerLink"
          [attr.tabindex]="!visible ? '-1' : null"
          [attr.target]="child.target"
          (mouseenter)="hover = true"
          (mouseleave)="hover = false"
        >
          <i [ngClass]="child.icon"></i>
          <span>{{ child.label }}</span>
          <i class="fa fa-fw fa-angle-down" *ngIf="child.items"></i>
        </a>

        <a
          (click)="itemClick($event, child, i)"
          *ngIf="child.routerLink"
          [routerLink]="child.routerLink"
          routerLinkActive="active-menuitem-routerlink"
          [routerLinkActiveOptions]="{ exact: true }"
          [attr.tabindex]="!visible ? '-1' : null"
          [attr.target]="child.target"
          (mouseenter)="hover = true"
          (mouseleave)="hover = false"
        >
          <i [ngClass]="child.icon"></i>
          <span>{{ child.label }}</span>
          <i class="fa fa-fw fa-angle-down" *ngIf="child.items"></i>
        </a>
        <ul
          app-submenu
          [item]="child"
          *ngIf="child.items"
          [@children]="isActive(i) ? 'visible' : 'hidden'"
          [visible]="isActive(i)"
        ></ul>
      </li>
    </ng-template>
  `,
  animations: [
    trigger("children", [
      state(
        "hidden",
        style({
          height: "0px",
        })
      ),
      state(
        "visible",
        style({
          height: "*",
        })
      ),
      transition(
        "visible => hidden",
        animate("400ms cubic-bezier(0.86, 0, 0.07, 1)")
      ),
      transition(
        "hidden => visible",
        animate("400ms cubic-bezier(0.86, 0, 0.07, 1)")
      ),
    ]),
  ],
})
export class AppSubMenu implements OnDestroy {
  @Input() item: MenuItem;

  @Input() root: boolean;

  @Input() visible: boolean;

  activeIndex: number;

  hover: boolean;

  constructor(
    @Inject(forwardRef(() => AppComponent))
    public app: AppComponent,
    public router: Router,
    public location: Location
  ) {}

  itemClick(event: Event, item: MenuItem, index: number) {
    //avoid processing disabled items
    if (item.disabled) {
      event.preventDefault();
      return true;
    }

    //activate current item and deactivate active sibling if any
    this.activeIndex = this.activeIndex === index ? null : index;

    //execute command
    if (item.command) {
      if (!item.eventEmitter) {
        item.eventEmitter = new EventEmitter();
        item.eventEmitter.subscribe(item.command);
      }

      item.eventEmitter.emit({
        originalEvent: event,
        item: item,
      });
    }

    //prevent hash change
    if (item.items || (!item.url && !item.routerLink)) {
      event.preventDefault();
    }

    //hide menu
    if (!item.items && (this.app.overlay || !this.app.isDesktop())) {
      this.app.sidebarActive = false;
    }
  }

  isActive(index: number): boolean {
    return this.activeIndex === index;
  }

  unsubscribe(item: any) {
    if (item.eventEmitter) {
      item.eventEmitter.unsubscribe();
    }

    if (item.items) {
      for (let childItem of item.items) {
        this.unsubscribe(childItem);
      }
    }
  }

  ngOnDestroy() {
    if (this.item && this.item.items) {
      for (let item of this.item.items) {
        this.unsubscribe(item);
      }
    }
  }
}
