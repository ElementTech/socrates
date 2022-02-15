import { Component, OnInit,NgZone, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.css']
})
export class ParametersComponent implements OnInit {


  Parameter:any;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['key', 'value','secret','configure'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  
  constructor(
    private router: Router,
    private ngZone: NgZone,
    private _snackBar: MatSnackBar,
    private apiService: ApiService) { 
    this.readParameter();

  }
  getParameter(id) {
    this.apiService.getParameter(id).subscribe(data => {
      
      this.Parameter = data;
        
    });
    
  }
  addParam(){
    console.log("hi")
    this.dataSource.data.unshift({"key":"","value":"","secret":false});
    this.dataSource.data = this.dataSource.data.slice();
  }
  togglePass(row) {
    if (row.secret)
    {
      document.getElementById(row.key).setAttribute("type","password");
    }
    else
    {
      this.dataSource.data[this.dataSource.data.indexOf(row)].value = ''
      document.getElementById(row.key).setAttribute("type","text");
    }
  }
  togglePassInit(row) {
    if (row.secret)
    {
      document.getElementById(row.key).setAttribute("type","password");
    }
    else
    {
      document.getElementById(row.key).setAttribute("type","text");
    }
  }


  removeParam(row){
    if(window.confirm('Are you sure?')) {
      console.log(row)
      this.apiService.deleteParameter(row._id).subscribe(data=>{
        this.dataSource.data.splice(this.dataSource.data.indexOf(row),1)
        this.readParameter()
      });
      // this.dataSource.data = this.dataSource.data.slice();
    }
  }
  saveParam(){
      console.log(this.dataSource.data)
      this.apiService.bulkParameter(this.dataSource.data).subscribe(data=>{
        console.log(data)
        this.readParameter()
        this._snackBar.open('Parameter Saved', 'Close', {
          duration: 3000
        });
      });
  }

  ngOnInit() {
     
  }
   //rest of your code..
 
  readParameter(){
    this.apiService.getParameters().subscribe((data) => {
     this.Parameter = data;
     console.log(data)
     this.dataSource = new MatTableDataSource(this.Parameter.reverse());
     this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.data.forEach(element => {
        this.togglePassInit(element)
    });
    })    
  }
  ngAfterViewInit() {

  }

 ngAfterViewChecked(){
    this.dataSource.data.forEach(element => {
        this.togglePassInit(element)
    });
 }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
   
    this.dataSource.filter = filterValue;
  }

  removeParameter(id) {

    if(window.confirm('Are you sure?')) {
    
        this.apiService.deleteParameter(id).subscribe(
          result => {
            // Handle result
            this.readParameter()
          },
          error => {
            if (error.includes("406"))
            {
              this._snackBar.open('Parameter Has Blocks Attached', 'Close', {
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

}
