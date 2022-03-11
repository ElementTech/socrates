import { Component, OnInit,NgZone, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Instance } from 'src/app/model/Instance';
import { ApiService } from '../../../services/api.service';
import { interval, Subscription } from 'rxjs';
@Component({
  selector: 'app-instance-stats',
  templateUrl: './instance-stats.component.html',
  styleUrls: ['./instance-stats.component.css']
})
export class InstanceStatsComponent implements OnInit {
  instance_id: string;
  single: any[];
  view: any[] = [400, 300];
  multi: any[];
  viewLine: any[] = [1000, 300];
  avg: any;
  subscription: Subscription;
  constructor(
    private router: Router,
    private ngZone: NgZone,
    private actRoute: ActivatedRoute,
    private apiService: ApiService) { 
    
      
  }

  ngOnInit(): void {
    this.instance_id = this.actRoute.snapshot.paramMap.get('id')
    const source = interval(10000);
    this.init();
    this.subscription = source.subscribe(val => this.init());
}

 init(){
  this.apiService.getDockerInstanceStatsByInstanceID(this.instance_id).subscribe(data=>
    {
      this.single = [{"name": "Success","value": data.success},{"name": "Failure","value": data.fail}]
      this.avg = data.avg
      this.multi = [
        {
          "name": "Runtime",
          "series": data.runs
        }
      ]
  })
 }

  // options
  gradient: boolean = false;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['#5AA454', '#A10A28'],
  };

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }



  // options
  legendLine: boolean = true;
  showLabelsLine: boolean = true;
  animationsLine: boolean = true;
  xAxisLine: boolean = true;
  yAxisLine: boolean = true;
  showYAxisLabelLine: boolean = true;
  showXAxisLabelLine: boolean = true;
  xAxisLabelLine: string = 'Run Number';
  yAxisLabelLine: string = 'Seconds';
  timelineLine: boolean = false;

  colorSchemeLine = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  onSelectLine(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivateLine(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivateLine(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
