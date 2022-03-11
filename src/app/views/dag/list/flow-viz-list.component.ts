import { Component, OnInit,NgZone, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import {FileUploadService} from '../../../services/file-upload.service'
import { Table } from 'primeng/table';
import { PrimeNGConfig } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-flow-viz-list',
  templateUrl: './flow-viz-list.component.html',
  styleUrls: ['./flow-viz-list.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class FlowVizListComponent implements OnInit {

 
  fetchLastBuild(thisFlow) {
  
    for (let index = 0; index < thisFlow.length; index++) {
      const element = thisFlow[index];
      this.apiService.getFlowvizInstanceByFlowvizID(element._id).subscribe(data => {
        thisFlow[index].nodes = thisFlow[index].nodes.length-1
        if (data.length != 0)
        {
          thisFlow[index].numruns = data.length
          if (data[0].done == true)
          {
            thisFlow[index].lastrun = !data[0].error
          }
          else
          {
            thisFlow[index].lastrun =  "running"
          }
        }
        else
        {
          thisFlow[index].numruns = 0
          thisFlow[index].lastrun =  "none"
        }
    });
    }
  
    return thisFlow
  }

  flows: any[];

  selectedFlows: any[];

  langs: any;

  statuses: any[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];

  lastRunOptions = ['true','false','running','none']

  imageUrls = {};

  onErrorOptions = ['continue','branch','tree']

  constructor(
    private apiService: ApiService,
    private uploadService: FileUploadService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService,
    private actRoute: ActivatedRoute,
    private confirmationService: ConfirmationService) { }

  deleteSelectedFlows() {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected products?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {

            const runs = []; 
       
            this.selectedFlows.forEach(flowToDelete=>{
              runs.push(this.apiService.deleteFlowviz(flowToDelete._id.toString()).toPromise());
            });
            Promise.allSettled(runs).then(promiseResult => {
              console.log(promiseResult)
              if (promiseResult.map(res=>res.status).includes("rejected") && promiseResult.map(res=>res.status).includes("fulfilled"))
              {
                this.messageService.add({severity:'warn', summary: 'Warning', detail: 'Some Flows Deleted.', life: 3000});
              }
              if (!promiseResult.map(res=>res.status).includes("rejected"))
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Flows Deleted', life: 3000});
              }
              if (!promiseResult.map(res=>res.status).includes("fulfilled"))
              {
                this.messageService.add({severity:'error', summary: 'Error', detail: 'Error Deleting Flows', life: 3000});
              }
              promiseResult.filter(res=>res.status=="fulfilled").forEach(toRemove=>{
                console.log(toRemove)
                // @ts-ignore
                if (Object.keys(toRemove).includes('msg'))
                {
                  console.log("first")
                  // @ts-ignore
                  this.flows = this.flows.filter(val => val._id!=toRemove.msg._id);
                }
                // @ts-ignore
                if (Object.keys(toRemove).includes('value'))
                {
                  console.log("second")
                  // @ts-ignore
                  this.flows = this.flows.filter(val => val._id!=toRemove.value.msg._id);
                }
              })
   
            }) 

            this.selectedFlows = null
       
        }
    });
}

  @ViewChild('dt', { static: true }) dt: any;
  ngOnInit() {
      this.apiService.getFlowvizs().subscribe(flows => {
          this.flows = flows;
          this.fetchLastBuild(flows)
          this.loading = false;

 

      });

      this.uploadService.getFiles().subscribe(data=>{
        data.forEach(element => {
          this.uploadService.getFileImage(element.name).subscribe(data => {
              let unsafeImageUrl = URL.createObjectURL(data);
              this.imageUrls[element.name]= this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
          }, error => {
              console.log(error);
          });
        });

      })
  }

}
