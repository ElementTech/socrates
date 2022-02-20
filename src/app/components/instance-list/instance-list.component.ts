import { Component, OnInit,NgZone, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Instance } from 'src/app/model/Instance';
import { ApiService } from '../../service/api.service';
@Component({
  selector: 'app-instance-list',
  templateUrl: './instance-list.component.html',
  styleUrls: ['./instance-list.component.css']
})

export class InstanceListComponent implements OnInit {

  Instance:any;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['run','name','desc','parameters','configure','block'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  blockSearch: string;
  
  constructor(
    private router: Router,
    private ngZone: NgZone,
    private _snackBar: MatSnackBar,
    private apiService: ApiService,
    private actRoute: ActivatedRoute
    ) { 
    
      
  }


  ngOnInit() {this.readInstance();}
   //rest of your code..
 
  readInstance(){
    this.apiService.getInstances().subscribe((data) => {
      console.log(data)
     this.dataSource = new MatTableDataSource(this.fetchLastBuild(data));
     
     this.dataSource.filterPredicate = function(data, filter: string): boolean {
        return data.name.toLowerCase().includes(filter.toLowerCase()) || data.desc.toLowerCase().includes(filter.toLowerCase()) || data.block["name"].toString().toLowerCase().includes(filter.toString().toLowerCase());
      };
    })    
  }
  ngAfterViewInit(){
    //this.fetchLastBuild()
    this.applyFilter(this.actRoute.snapshot.paramMap.get('name'))
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  removeInstance(id) {

    if(window.confirm('Are you sure?')) {
    
        this.apiService.deleteInstance(id).subscribe(
          result => {
            // Handle result
            this.readInstance()
          },
          error => {
            if (error.includes("406"))
            {
              this._snackBar.open('Instance Has Flows Attached', 'Close', {
                duration: 3000
              });
            }
          },
          () => {
            // 'onCompleted' callback.
            // No errors, route to new page here
          }
        );

    }
  }

  fetchLastBuild(thisInstance) {
  
    for (let index = 0; index < thisInstance.length; index++) {
      const element = thisInstance[index];
      this.apiService.getDockerInstanceByInstanceID(element._id).subscribe(data => {
      
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