import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { AppRoutes } from "./app.routes";
import "rxjs/add/operator/toPromise";

import { AccordionModule } from "primeng/primeng";
import { AutoCompleteModule } from "primeng/primeng";
import { BreadcrumbModule } from "primeng/primeng";
import { ButtonModule } from "primeng/primeng";
import { CalendarModule } from "primeng/primeng";
import { CarouselModule } from "primeng/primeng";
import { ChartModule } from "primeng/primeng";
import { CheckboxModule } from "primeng/primeng";
import { ChipsModule } from "primeng/primeng";
import { CodeHighlighterModule } from "primeng/primeng";
import { ConfirmDialogModule } from "primeng/primeng";
import { SharedModule } from "primeng/primeng";
import { ContextMenuModule } from "primeng/primeng";
import { DataGridModule } from "primeng/primeng";
import { DataListModule } from "primeng/primeng";
import { DataScrollerModule } from "primeng/primeng";
import { DataTableModule } from "primeng/primeng";
import { DialogModule } from "primeng/primeng";
import { DragDropModule } from "primeng/primeng";
import { DropdownModule } from "primeng/primeng";
import { EditorModule } from "primeng/primeng";
import { FieldsetModule } from "primeng/primeng";
import { FileUploadModule } from "primeng/primeng";
import { GalleriaModule } from "primeng/primeng";
import { GMapModule } from "primeng/primeng";
import { GrowlModule } from "primeng/primeng";
import { InputMaskModule } from "primeng/primeng";
import { InputSwitchModule } from "primeng/primeng";
import { InputTextModule } from "primeng/primeng";
import { InputTextareaModule } from "primeng/primeng";
import { LightboxModule } from "primeng/primeng";
import { ListboxModule } from "primeng/primeng";
import { MegaMenuModule } from "primeng/primeng";
import { MenuModule } from "primeng/primeng";
import { MenubarModule } from "primeng/primeng";
import { MessagesModule } from "primeng/primeng";
import { MultiSelectModule } from "primeng/primeng";
import { OrderListModule } from "primeng/primeng";
import { OverlayPanelModule } from "primeng/primeng";
import { PaginatorModule } from "primeng/primeng";
import { PanelModule } from "primeng/primeng";
import { PanelMenuModule } from "primeng/primeng";
import { PasswordModule } from "primeng/primeng";
import { PickListModule } from "primeng/primeng";
import { ProgressBarModule } from "primeng/primeng";
import { RadioButtonModule } from "primeng/primeng";
import { RatingModule } from "primeng/primeng";
import { ScheduleModule } from "primeng/primeng";
import { SelectButtonModule } from "primeng/primeng";
import { SlideMenuModule } from "primeng/primeng";
import { SliderModule } from "primeng/primeng";
import { SpinnerModule } from "primeng/primeng";
import { SplitButtonModule } from "primeng/primeng";
import { StepsModule } from "primeng/primeng";
import { TabMenuModule } from "primeng/primeng";
import { TabViewModule } from "primeng/primeng";
import { TerminalModule } from "primeng/primeng";
import { TieredMenuModule } from "primeng/primeng";
import { ToggleButtonModule } from "primeng/primeng";
import { ToolbarModule } from "primeng/primeng";
import { TooltipModule } from "primeng/primeng";
import { TreeModule } from "primeng/primeng";
import { TreeTableModule } from "primeng/primeng";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home.component";
import { AppMenuComponent, AppSubMenu } from "./app.menu.component";
import { AppSideBarComponent } from "./app.sidebar.component";
import { AppSidebarTabContent } from "./app.sidebartabcontent.component";
import { AppTopBar } from "./app.topbar.component";
import { AppFooter } from "./app.footer.component";

import {
  DashboardComponent,
  FeedsComponent,
  MailComponent,
  SponsorsComponent,
  LoginComponent
} from "./pages";
import {
  AuthService,
  EventService,
  FeedService,
  MailService,
  UserService,
  StreamAdminService
} from "./core";
import { AuthGuard } from "./core/guards/authguard";

const PAGES = [
  DashboardComponent,
  FeedsComponent,
  MailComponent,
  SponsorsComponent,
  LoginComponent
];
const SERVICES = [
  EventService,
  FeedService,
  MailService,
  UserService,
  AuthService,
  StreamAdminService
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutes,
    HttpModule,
    BrowserAnimationsModule,
    AccordionModule,
    AutoCompleteModule,
    BreadcrumbModule,
    ButtonModule,
    CalendarModule,
    CarouselModule,
    ChartModule,
    CheckboxModule,
    ChipsModule,
    CodeHighlighterModule,
    ConfirmDialogModule,
    SharedModule,
    ContextMenuModule,
    DataGridModule,
    DataListModule,
    DataScrollerModule,
    DataTableModule,
    DialogModule,
    DragDropModule,
    DropdownModule,
    EditorModule,
    FieldsetModule,
    FileUploadModule,
    GalleriaModule,
    GMapModule,
    GrowlModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    LightboxModule,
    ListboxModule,
    MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessagesModule,
    MultiSelectModule,
    OrderListModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    ScheduleModule,
    SelectButtonModule,
    SlideMenuModule,
    SliderModule,
    SpinnerModule,
    SplitButtonModule,
    StepsModule,
    TabMenuModule,
    TabViewModule,
    TerminalModule,
    TieredMenuModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TreeModule,
    TreeTableModule
  ],
  declarations: [
    AppComponent,
    AppMenuComponent,
    AppSubMenu,
    AppSideBarComponent,
    AppSidebarTabContent,
    AppTopBar,
    AppFooter,
    HomeComponent,
    ...PAGES
  ],
  providers: [
    // { provide: LocationStrategy, useClass: HashLocationStrategy },
    ...SERVICES,
    AuthGuard
  ],
  bootstrap: [HomeComponent]
})
export class AppModule {}
