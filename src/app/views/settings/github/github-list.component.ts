import { Component, OnInit,NgZone, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import {MatDialogActions} from '@angular/material/dialog'


@Component({
  selector: 'app-github-list',
  templateUrl: './github-list.component.html',
  styleUrls: ['./github-list.component.css']
})



export class GithubListComponent implements OnInit {

  githubConnected = false

  Github:any;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['path','prefix','content','sha'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private ngZone: NgZone,
    private apiService: ApiService) { 
    this.readGithub();

  }

  openDialog(content) {
    const dialogRef = this.dialog.open(DialogContentExampleDialog,{data: {content:atob(content)}});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


  getGithub(id) {
    this.apiService.getGithubElement(id).subscribe(data => {
      
      this.Github = data;
        
    });
    
  }

  ngOnInit() {
      this.apiService.getSettings().subscribe(data=>{
        this.githubConnected = data[0].github[0].githubConnected
      });
  }
   //rest of your code..
 
  readGithub(){
    this.apiService.getGithubElements().subscribe((data) => {
     this.Github = data;
     
     this.dataSource = new MatTableDataSource(this.Github); //
     this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  
    })    
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }



}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',
})
export class DialogContentExampleDialog {
  ready: boolean;
  constructor(
    public dialogRef: MatDialogRef<DialogContentExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {this.dialogRef.afterOpened().subscribe(() => setTimeout(() => this.ready = true, 0));}
  
}