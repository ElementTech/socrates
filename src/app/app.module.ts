import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { BlockCreateComponent } from './components/block-create/block-create.component';
import { BlockListComponent } from './components/block-list/block-list.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {NgxPaginationModule} from 'ngx-pagination';
import { ApiService } from './service/api.service';
import { HomeComponent } from './components/home/home.component';
import { InstanceListComponent } from './components/instance-list/instance-list.component';
import { InstanceCreateComponent } from './components/instance-create/instance-create.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon'
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table'  
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { SidenavService } from './service/sidenav.service';
import {MatBadgeModule} from '@angular/material/badge';
import {MatChipsModule} from '@angular/material/chips';
import { InstanceRunComponent } from './components/instance-run/instance-run.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDividerModule} from '@angular/material/divider'
import {MatMenuModule} from '@angular/material/menu'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SettingsComponent } from './components/settings/settings.component';
import {MatCardModule} from '@angular/material/card';
import { InstanceStatsComponent } from './components/instance-stats/instance-stats.component'
import { FlowStatsComponent } from './components/flow-stats/flow-stats.component'
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FlowListComponent } from './components/flow-list/flow-list.component';
import { FlowCreateComponent } from './components/flow-create/flow-create.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FlowRunComponent } from './components/flow-run/flow-run.component';
import { ParametersComponent } from './components/parameters/parameters.component'
import { FlexLayoutModule } from '@angular/flex-layout';
import { FileService } from './components/file-manager/service/file.service';
import { FileManagerModule } from './components/file-manager/file-manager.module';
import { PortalComponent } from './components/portal/portal.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GithubListComponent,DialogContentExampleDialog } from './components/github-list/github-list.component';
import {MatDialogModule} from '@angular/material/dialog'
import { AuthenticationService } from './service/authentication.service';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuardService } from './service/auth-guard.service';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { BlockStatsComponent } from './components/block-stats/block-stats.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { FileUploadService } from './service/file-upload.service';
import {MatTabsModule} from '@angular/material/tabs';
import { DescDialogComponent } from './components/desc-dialog/desc-dialog.component';
import { ArtifactsComponent } from './components/artifacts/artifacts.component';
import { FlowVizComponent } from './components/flow-viz/flow-viz.component';
import {NgxGraphModule} from '@swimlane/ngx-graph'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { FlowVizListComponent } from './components/flow-viz-list/flow-viz-list.component';
import { FlowvizRunComponent } from './components/flow-viz-run/flow-viz-run.component';
import { FlowPortalComponent } from './components/flow-portal/flow-portal.component';
import { FlowvizStatsComponent } from './components/flow-viz-stats/flow-viz-stats.component';
import {TableModule} from 'primeng/table';
import {CalendarModule} from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';
import {DialogModule} from 'primeng/dialog';
import {MultiSelectModule} from 'primeng/multiselect';
import {ContextMenuModule} from 'primeng/contextmenu';
import {ButtonModule} from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import {InputTextModule} from 'primeng/inputtext';
import {ProgressBarModule} from 'primeng/progressbar';
import {DropdownModule} from 'primeng/dropdown';
import {FileUploadModule} from 'primeng/fileupload';
import {ToolbarModule} from 'primeng/toolbar';
import {RatingModule} from 'primeng/rating';
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputNumberModule} from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {TooltipModule} from 'primeng/tooltip';
import { InputTextareaModule } from 'primeng/inputtextarea';
import {BadgeModule} from 'primeng/badge';
import { ChipModule } from 'primeng/chip';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import {MenubarModule} from 'primeng/menubar';

import {SplitButtonModule} from 'primeng/splitbutton';

// import {SocialLoginModule,GoogleLoginProvider} from 'angularx-social-login'
@NgModule({
  declarations: [
    AppComponent,
    BlockCreateComponent,
    BlockListComponent,
    HomeComponent,
    InstanceListComponent,
    InstanceCreateComponent,
    InstanceRunComponent,
    SettingsComponent,
    InstanceStatsComponent,
    DescDialogComponent,
    FlowListComponent,
    FlowCreateComponent,
    FlowRunComponent,
    FlowStatsComponent,
    ParametersComponent,
    PortalComponent,
    GithubListComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    DialogContentExampleDialog,
    UnauthorizedComponent,
    UserListComponent,
    BlockStatsComponent,
    FileUploadComponent,
    DescDialogComponent,
    ArtifactsComponent,
    FlowVizComponent,
    FlowVizListComponent,
    FlowvizRunComponent,
    FlowPortalComponent,
    FlowvizStatsComponent
    
  ],
  imports: [
    MenubarModule,
    SplitButtonModule,
    TagModule,
    ChipModule,
    BadgeModule,
    FileUploadModule,
    ToolbarModule,
    RatingModule,
    RadioButtonModule,
    InputNumberModule,
    ConfirmDialogModule,
    TooltipModule,
    InputTextareaModule,
    CalendarModule,
    SliderModule,
    DialogModule,
    MultiSelectModule,
    ContextMenuModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    ProgressBarModule,
    DropdownModule,
    NgxChartsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    CodemirrorModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatGridListModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatStepperModule,
    MatSelectModule,
    MatBadgeModule,
    MatChipsModule,
    MatSnackBarModule,
    MatCheckboxModule,
    ScrollingModule,
    MatDividerModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatCardModule,
    DragDropModule,
    InfiniteScrollModule,
    MatSlideToggleModule,
    FileManagerModule,
    FlexLayoutModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatNativeDateModule,
    MatDialogModule,
    MatTabsModule,
    NgxGraphModule,
    MatAutocompleteModule,
    TableModule
    // SocialLoginModule
  ],
  providers: [
  //   {
  //   provide: 'SocialAuthServiceConfig',
  //   useValue: {
  //     autoLogin: true, //keeps the user signed in
  //     providers: [
  //       {
  //         id: GoogleLoginProvider.PROVIDER_ID,
  //         provider: new GoogleLoginProvider('68690114620-49b1oeghknmcus8onj9blofd4av2pr8i.apps.googleusercontent.com') // your client id
  //       }
  //     ]
  //   }
  // },
  ApiService,SidenavService,FileService,AuthenticationService,AuthGuardService,FileUploadService,ConfirmationService,MessageService],
  bootstrap: [AppComponent]
})

export class AppModule { }