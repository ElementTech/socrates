import { Component, OnInit,NgZone, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  User:any;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['email','name','admin','configure'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  
  constructor(
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService) { 

  }


  ngOnInit() {this.readUser()}
   //rest of your code..
 
  readUser(){
    this.apiService.getUsers().subscribe((data) => {
     this.User = data;
     
     this.dataSource = new MatTableDataSource(this.User); //
     this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  
    })    
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  removeUser(id) {

    if(window.confirm('Are you sure?')) {
    
        this.apiService.deleteUser(id).subscribe((data) => {
          this.readUser();
       
        })    
    }  
  }
  makeAdmin(id){
    this.apiService.updateUser(id,{admin:true}).subscribe((data) => {
      this.readUser();
   
    })
  }
  revokeAdmin(id){
    this.apiService.updateUser(id,{admin:false}).subscribe((data) => {
      this.readUser();
    })
  }



}
