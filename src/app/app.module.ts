import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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
    FlowListComponent,
    FlowCreateComponent,
    FlowRunComponent,
    FlowStatsComponent,
    ParametersComponent,
    PortalComponent
  ],
  imports: [
    NgxChartsModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
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
    FlexLayoutModule
  ],
  providers: [ApiService,SidenavService,FileService],
  bootstrap: [AppComponent]
})

export class AppModule { }