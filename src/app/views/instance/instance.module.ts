import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import {ListboxModule} from 'primeng/listbox';
// CoreUI Modules
import {
  AccordionModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonModule,
  CardModule,
  CarouselModule,
  CollapseModule,
  DropdownModule,
  FormModule,
  GridModule,
  ListGroupModule,
  NavModule,
  PaginationModule,
  PopoverModule,
  ProgressModule,
  SharedModule,
  SpinnerModule,
  TableModule,
  TabsModule,
  TooltipModule,
  UtilitiesModule,
} from '@coreui/angular';

import { IconModule } from '@coreui/icons-angular';

// utils


// views
import { InstanceCreateComponent } from './create/instance-create.component';
import { InstanceRunComponent } from './run/instance-run.component';
import { ArtifactsComponent } from './artifacts/artifacts.component';
import { InstanceListComponent } from './list/instance-list.component';
import { InstanceStatsComponent } from './stats/instance-stats.component'
// Components Routing
import { InstanceRoutingModule } from './instance-routing.module';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {TableModule as TableNGModule} from 'primeng/table';
import {CalendarModule} from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';
import {DialogModule} from 'primeng/dialog';
import {MultiSelectModule} from 'primeng/multiselect';
import {ContextMenuModule} from 'primeng/contextmenu';
import {ButtonModule as ButtonNGModule} from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import {InputTextModule} from 'primeng/inputtext';
import {ProgressBarModule} from 'primeng/progressbar';
import {DropdownModule as DropdownNGModule} from 'primeng/dropdown';
import {FileUploadModule} from 'primeng/fileupload';
import {ToolbarModule} from 'primeng/toolbar';
import {RatingModule} from 'primeng/rating';
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputNumberModule} from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {TooltipModule as TooltipNGModule} from 'primeng/tooltip';
import { InputTextareaModule } from 'primeng/inputtextarea';
import {BadgeModule as BadgeNGModule} from 'primeng/badge';
import {ChipModule} from 'primeng/chip';
import {TagModule} from 'primeng/tag';
import {MenubarModule} from 'primeng/menubar';
import {SelectButtonModule} from 'primeng/selectbutton';
import {SplitButtonModule} from 'primeng/splitbutton';


import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
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
import {MatBadgeModule} from '@angular/material/badge';
import {MatChipsModule} from '@angular/material/chips';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDividerModule} from '@angular/material/divider'
import {MatMenuModule} from '@angular/material/menu'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatDialogModule} from '@angular/material/dialog'
import {MatTabsModule} from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import {CheckboxModule} from 'primeng/checkbox';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {ScheduleDialogComponent} from '../../../components/schedule/schedule-dialog.component'
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CronEditorModule } from '../../../components/cron-editor/lib/cron-editor.module';
import { MonacoEditorModule } from 'ngx-monaco-editor';
@NgModule({
  imports: [
    CommonModule,
    InstanceRoutingModule,
    AccordionModule,
    BadgeModule,
    BreadcrumbModule,
    ButtonModule,
    CardModule,
    CollapseModule,
    GridModule,
    CheckboxModule,
    UtilitiesModule,
    SharedModule,
    ListGroupModule,
    IconModule,
    ListGroupModule,
    ProgressModule,
    ProgressSpinnerModule,
    SpinnerModule,
    TabsModule,
    NavModule,
    ListboxModule,
    TooltipModule,
    CarouselModule,
    FormModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    PaginationModule,
    PopoverModule,
    TableModule,
    
    // PRIME NG
    TableNGModule,
    CalendarModule,
    SliderModule,
    DialogModule,
    MultiSelectModule,
    ContextMenuModule,
    ButtonNGModule,
    ToastModule,
    InputTextModule,
    ProgressBarModule,
    DropdownNGModule,
    FileUploadModule,
    ToolbarModule,
    RatingModule,
    RadioButtonModule,
    InputNumberModule,
    ConfirmDialogModule,
    TooltipNGModule,
    InputTextareaModule,
    BadgeNGModule,
    ChipModule,
    TagModule,
    MenubarModule,
    SelectButtonModule,
    SplitButtonModule,
    // Angular Material
    DragDropModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatListModule,
    MatGridListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatStepperModule,
    MatSelectModule,
    MatInputModule,
    MatBadgeModule,
    MatChipsModule,
    MatSnackBarModule,
    MatDividerModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatCardModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTabsModule,
    MatAutocompleteModule,
    DynamicDialogModule,
    // Codemirror
    CodemirrorModule,
    // Infinite
    InfiniteScrollModule,
    NgxChartsModule,
    CronEditorModule,
    MonacoEditorModule.forRoot()
  ],
  declarations: [
    InstanceListComponent,
    InstanceCreateComponent,
    InstanceRunComponent,
    ArtifactsComponent,
    InstanceStatsComponent,
    ScheduleDialogComponent
  ]
})
export class InstanceModule {}
