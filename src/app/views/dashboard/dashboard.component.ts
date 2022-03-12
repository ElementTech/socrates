import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component,OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';


@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  data: Observable<any>;


  ngOnInit(): void {
    this.data = this.apiService.getDashboard()
    this.apiService.getDashboard().subscribe(data=>{
      console.log(data)
    })
  }

  view: any[] = [400, 200];
  

  // options
  gradient: boolean = false;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(private apiService: ApiService) {
   
  }

}
