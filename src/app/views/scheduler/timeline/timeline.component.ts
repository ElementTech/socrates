import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService, PrimeIcons } from 'primeng/api';
import { ApiService } from '../../../services/api.service';
import {NgxTimelineEventGroup} from '@frxjs/ngx-timeline'
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

interface NgxTimelineEvent {
  timestamp?: Date;
  title?: string;
  description?: string;
  id?: any;
}
@AutoUnsubscribe()
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  providers: [MessageService]
})

export class TimelineComponent implements OnInit {
  ngOnDestroy(){clearInterval(this.refresher)}
  constructor(private apiService: ApiService,public messageService: MessageService) { }

  // this.events = [
  //   {status: 'Ordered', date: '15/10/2020 10:30', icon: PrimeIcons.SHOPPING_CART, color: '#9C27B0'},
  //   {status: 'Processing', date: '15/10/2020 14:00', icon: PrimeIcons.COG, color: '#673AB7'},
  //   {status: 'Shipped', date: '15/10/2020 16:15', icon: PrimeIcons.ENVELOPE, color: '#FF9800'},
  //   {status: 'Delivered', date: '16/10/2020 10:00', icon: PrimeIcons.CHECK, color: '#607D8B'}
  // ];

  timeline: Array<NgxTimelineEvent>
  refresher: any;
  ngOnInit() {
    this.getData()
    this.refresher = setInterval(()=> {
    this.getData()
    },1000*30)
  }
  getImage(event)
  {
    console.log(event)
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
    
    this.apiService.getScheduleRuns().subscribe((data:any) => {
      this.timeline = data.map(item=>{
        return {
          "timestamp": new Date(item.createdAt),
          "title": item.job,
          "description": item.type,
          "component_id": item.component_id,
          "id": item.run_id,
          "done": item.done,
          "error": item.error,
          "type": item.type
        }
      })
    });
  }

}