import { Component, AfterViewInit, ElementRef, Renderer, ViewChild } from "@angular/core";

enum MenuOrientation {
  STATIC,
  OVERLAY
}

@Component({
  selector: "app-home",
  template: `<router-outlet></router-outlet>`
})
export class HomeComponent {
  
}
