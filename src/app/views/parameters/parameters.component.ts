import { Component, OnInit,NgZone, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Parameter } from '../../model/parameter';
import {v4 as uuidv4} from 'uuid';
@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.css'],
  providers: [MessageService]
})
export class ParametersComponent implements OnInit {


//   Parameter:any;
//   dataSource: MatTableDataSource<any>;
//   displayedColumns = ['key', 'value','secret','configure'];
//   @ViewChild(MatPaginator) paginator: MatPaginator;
//   @ViewChild(MatSort, { static: true }) sort: MatSort;
  
//   constructor(
//     private router: Router,
//     private ngZone: NgZone,
//     private _snackBar: MatSnackBar,
//     private apiService: ApiService) { 
    

//   }
//   getParameter(id) {
//     this.apiService.getParameter(id).subscribe(data => {
//       this.Parameter = data;
//     });
    
//   }
//   addParam(){
//     this.dataSource.data.unshift({"key":"","value":"","secret":false});
//     this.dataSource.data = this.dataSource.data.slice();
//   }
//   togglePass(row) {
//     if (row.secret)
//     {
//       document.getElementById(row.key).setAttribute("type","password");
//     }
//     else
//     {
//       this.dataSource.data[this.dataSource.data.indexOf(row)].value = ''
//       document.getElementById(row.key).setAttribute("type","text");
//     }
//   }
//   togglePassInit(row) {
//     if (row.secret)
//     {
//       document.getElementById(row.key).setAttribute("type","password");
//     }
//     else
//     {
//       document.getElementById(row.key).setAttribute("type","text");
//     }
//   }


//   removeParam(row){
//     if(window.confirm('Are you sure?')) {
//       this.apiService.deleteParameter(row._id).subscribe(data=>{
//         this.dataSource.data.splice(this.dataSource.data.indexOf(row),1)
//         this.readParameter()
//       });
//       // this.dataSource.data = this.dataSource.data.slice();
//     }
//   }
//   saveParam(){
//       console.log(this.dataSource.data)
//       this.apiService.bulkParameter(this.dataSource.data).subscribe(data=>{
//         this.readParameter()
//         this._snackBar.open('Parameter Saved', 'Close', {
//           duration: 3000
//         });
//       });
//   }

//   ngOnInit() {
//     this.readParameter();
//   }
//    //rest of your code..
 
//   readParameter(){
//     this.apiService.getParameters().subscribe((data) => {
//      this.Parameter = data;
//      this.dataSource = new MatTableDataSource(this.Parameter.reverse());
//      this.dataSource.paginator = this.paginator;
//       this.dataSource.sort = this.sort;
//       this.dataSource.data.forEach(element => {
//         this.togglePassInit(element)
//       });
//     })    
//   }
//   ngAfterViewInit() {

//     this.doSecret()
//   }

//   async doSecret() {

//     await this.until(_ => this.dataSource);

//     this.dataSource.data.forEach(element => {
//       this.togglePassInit(element)
//     });

//   }

//   until(conditionFunction) {

//     const poll = resolve => {
//       if(conditionFunction()) resolve();
//       else setTimeout(_ => poll(resolve), 100);
//     }
  
//     return new Promise(poll);
//   }


//  ngAfterViewChecked(){
   
//  }

//   applyFilter(filterValue: string) {
//     filterValue = filterValue.trim(); // Remove whitespace
//     filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
   
//     this.dataSource.filter = filterValue;
//   }

//   removeParameter(id) {

//     if(window.confirm('Are you sure?')) {
    
//         this.apiService.deleteParameter(id).subscribe(
//           result => {
//             // Handle result
//             this.readParameter()
//           },
//           error => {
//             if (error.includes("406"))
//             {
//               this._snackBar.open('Parameter Has Blocks Attached', 'Close', {
//                 duration: 3000
//               });
//             }
//           },
//           () => {
//             // 'onCompleted' callback.
//             // No errors, route to new page here
//           }
//         );
   
//     }
 
    
//   }


  // NEW

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
