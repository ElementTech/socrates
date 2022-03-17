import { Component, OnInit,NgZone, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Parameter } from 'src/app/model/Parameter';
import {v4 as uuidv4} from 'uuid';
@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.css'],
  providers: [MessageService]
})
export class ParametersComponent implements OnInit {

  parameters1: any;

  parameters2: any;

  statuses: SelectItem[];

  clonedProducts: { [s: string]: Parameter; } = {};

  constructor(private apiService: ApiService, private messageService: MessageService) { }

  ngOnInit() {
      this.apiService.getParameters().subscribe(data => {this.parameters1 = data,this.parameters2 = data});

      this.statuses = [{label: 'True', value: true},{label: 'False', value: false}]
    }

    onRowEditInit(product: Parameter) {
        this.clonedProducts[product._id] = {...product};
    }

    onRowEditSave(product: Parameter) {
        this.apiService.updateParameter(product._id,product).subscribe(
          data=>{
            delete this.clonedProducts[product._id];
            this.apiService.getParameters().subscribe(data => {this.parameters1 = data,this.parameters2 = data});
            this.messageService.add({severity:'success', summary: 'Success', detail:'Parameter is Updated'});
          },
          error=>{
            this.messageService.add({severity:'error', summary: 'Error', detail:'Parameter Could not be Updated'});
          }
        );
    }

    onRowEditRemove(product: Parameter) {
      if(window.confirm('Are you sure?')) 
      {
        this.apiService.deleteParameter(product._id).subscribe(data=>{
          delete this.clonedProducts[product._id];
          this.apiService.getParameters().subscribe(data => {this.parameters1 = data,this.parameters2 = data});
          this.messageService.add({severity:'success', summary: 'Success', detail:'Parameter is Deleted'});
        },
        error=>{
          this.messageService.add({severity:'error', summary: 'Error', detail:'Parameter Could not be Deleted'});
        });
      }
    }

    onRowEditCancel(product: Parameter, index: number) {
        this.parameters2[index] = this.clonedProducts[product._id];
        delete this.clonedProducts[product._id];
    }

    onChange(event,parameter)
    {
      if (!event.value)
      {
        this.parameters1.find(p=>p._id==parameter._id).value = '';
      }
    }

    addParameter()
    {
      const CUSTOM_ID = uuidv4().replace(/-/g, "").substring(0,24)
      this.parameters1.unshift({"_id": CUSTOM_ID,"key":"","value":"","secret":false})
      // this.clonedProducts[CUSTOM_ID] = {...{"key":"","value":"","secret":false}};
    }
}
