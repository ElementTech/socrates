import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManagerComponent } from './file-manager.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { NewFolderDialogComponent } from './modals/newFolderDialog/newFolderDialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { RenameDialogComponent } from './modals/renameDialog/renameDialog.component';
import { NewFileDialogComponent } from './modals/newFileDialog/newFileDialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import {PanelModule} from 'primeng/panel';
import {ButtonModule} from 'primeng/button';
import {MenuModule} from 'primeng/menu';
import { ChartjsModule } from '@coreui/angular-chartjs';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatIconModule,
    MatGridListModule,
    MenuModule,
    MatMenuModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
    MatSelectModule,
    PanelModule,
    ButtonModule,
    ChartjsModule
  ],
  declarations: [FileManagerComponent, NewFolderDialogComponent, RenameDialogComponent, NewFileDialogComponent],
  exports: [FileManagerComponent],
  entryComponents: [NewFolderDialogComponent, RenameDialogComponent, NewFileDialogComponent]
})
export class FileManagerModule {}
