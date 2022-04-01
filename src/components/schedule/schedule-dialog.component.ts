import {Component} from '@angular/core';
import { FormControl } from '@angular/forms';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import { CronOptions } from '../cron-editor/lib/CronOptions';

@Component({
    selector: 'schedule-dialog-run',
    templateUrl: './schedule-dialog.component.html',
})
export class ScheduleDialogComponent {
    public cronExpression = '0 12 1W 1/1 ?';
    public isCronDisabled = false;
    public cronOptions: CronOptions = {
      formInputClass: 'form-control cron-editor-input',
      formSelectClass: 'form-control cron-editor-select',
      formRadioClass: 'cron-editor-radio',
      formCheckboxClass: 'cron-editor-checkbox',
  
      defaultTime: '10:00:00',
      use24HourTime: true,
  
      hideMinutesTab: false,
      hideHourlyTab: false,
      hideDailyTab: false,
      hideWeeklyTab: false,
      hideMonthlyTab: false,
      hideYearlyTab: false,
      hideAdvancedTab: false,
  
      hideSeconds: true,
      removeSeconds: true,
      removeYears: true
    };
    constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }
    ngOnInit() {
        console.log(this.config.data)


        // this.productService.getProductsSmall().then(products => this.products = products);
    }

    selectCron() {
        this.ref.close(this.cronExpression);
    }
    
}