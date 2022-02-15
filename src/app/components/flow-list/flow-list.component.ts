import { Component, OnInit,NgZone, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-flow-list',
  templateUrl: './flow-list.component.html',
  styleUrls: ['./flow-list.component.css']
})
export class FlowListComponent implements OnInit {

  Flow:any;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['run','name','desc','configure'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  
  constructor(
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService) { 
    this.readFlow();

  }
  getFlow(id) {
    this.apiService.getFlow(id).subscribe(data => {
      
      this.Flow = data;
        
    });
    
  }

  ngOnInit() {}
   //rest of your code..
 
  readFlow(){
    this.apiService.getFlows().subscribe((data) => {
     this.Flow = data;
     
     this.dataSource = new MatTableDataSource(this.fetchLastBuild(this.Flow)); //
     this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  
    })    
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  removeFlow(id) {

    if(window.confirm('Are you sure?')) {
    
        this.apiService.deleteFlow(id).subscribe((data) => {
          this.readFlow();
       
        })    
    }  
  }

  fetchLastBuild(thisInstance) {
  
    for (let index = 0; index < thisInstance.length; index++) {
      const element = thisInstance[index];
      this.apiService.getFlowInstanceByFlowID(element._id).subscribe(data => {
      
        if (data.length != 0)
        {
          thisInstance[index].numruns = data.length
          if (data[0].done == true)
          {
            thisInstance[index].lastrun = data[0].error
          }
          else
          {
            thisInstance[index].lastrun =  "running"
          }
        }
        else
        {
          thisInstance[index].numruns = 0
          thisInstance[index].lastrun =  "none"
        }
    });
    }
  
    return thisInstance
  }

}
