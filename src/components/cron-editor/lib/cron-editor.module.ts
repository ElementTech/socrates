import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CronEditorComponent } from './cron-editor.component';
import { TimePickerComponent } from './time-picker/time-picker.component';

@NgModule({
  declarations: [CronEditorComponent, TimePickerComponent],
  imports: [CommonModule, FormsModule],
  exports: [CronEditorComponent]
})
export class CronEditorModule { }
