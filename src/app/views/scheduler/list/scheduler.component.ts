import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService, PrimeIcons } from 'primeng/api';
import { ApiService } from '../../../services/api.service';
import {NgxTimelineEventGroup} from '@frxjs/ngx-timeline'
interface NgxTimelineEvent {
  timestamp?: Date;
  title?: string;
  description?: string;
  id?: any;
}
@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
  providers: [MessageService]
})

export class SchedulerComponent implements OnInit {

  constructor(private apiService: ApiService,public messageService: MessageService) { }

  // this.events = [
  //   {status: 'Ordered', date: '15/10/2020 10:30', icon: PrimeIcons.SHOPPING_CART, color: '#9C27B0'},
  //   {status: 'Processing', date: '15/10/2020 14:00', icon: PrimeIcons.COG, color: '#673AB7'},
  //   {status: 'Shipped', date: '15/10/2020 16:15', icon: PrimeIcons.ENVELOPE, color: '#FF9800'},
  //   {status: 'Delivered', date: '16/10/2020 10:00', icon: PrimeIcons.CHECK, color: '#607D8B'}
  // ];

  events: any;
  scheduler: Array<NgxTimelineEvent>


  ngOnInit() {
    this.getData()
    setInterval(()=> {
    this.getData()
    },1000*60)
  }
  getIcon(type)
  { 
    switch (type) {
      case 'instance':
        return PrimeIcons.MICROSOFT
      case 'step':
        return PrimeIcons.LIST
      case 'dag':
        return PrimeIcons.SITEMAP
      default:
        return ''
    }
  }

  getData(){
    this.apiService.getSchedules().subscribe((data:any) => {
      this.events = data.sort((a,b)=>a.nextRunAt-b.nextRunAt);
    });

  }
  deleteSchedule(name)
  {
    if(window.confirm('Are you sure?')) {
      console.log(name)
      this.apiService.deleteSchedule(name).subscribe(
        (res) => {
  
          this.messageService.add({severity:'success', summary: 'Schedule Deleted'});
          this.apiService.getSchedules().subscribe(data => {
            this.events = data
          });
        }, (error) => {
          console.log(error);
          this.messageService.add({severity:'error', summary: 'Schedule could not be deleted', detail: error});
          this.apiService.getSchedules().subscribe(data => {
            this.events = data
          });
      });
    }



  }
}