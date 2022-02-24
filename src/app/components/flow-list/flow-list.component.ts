import { Component, OnInit,NgZone, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FileUploadService } from 'src/app/service/file-upload.service';
import { ApiService } from '../../service/api.service';
import { DescDialogComponent } from '../desc-dialog/desc-dialog.component';

@Component({
  selector: 'app-flow-list',
  templateUrl: './flow-list.component.html',
  styleUrls: ['./flow-list.component.css']
})
export class FlowListComponent implements OnInit {

  Flow:any;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['run','name','steps','instances','configure'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  imageUrls = {};
  constructor(
    private sanitizer: DomSanitizer,
    private uploadService: FileUploadService,
    private router: Router,
    private ngZone: NgZone,
    public dialog: MatDialog,
    private apiService: ApiService) { 
    this.readFlow();

  }
  getFlow(id) {
    this.apiService.getFlow(id).subscribe(data => {
      
      this.Flow = data;
        
    });
    
  }

  ngOnInit() {
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
   //rest of your code..
 
  readFlow(){
    this.apiService.getFlows().subscribe((data) => {
     this.Flow = data;
     
     this.dataSource = new MatTableDataSource(this.fetchLastBuild(this.Flow)); //
     this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  
    })    
  }
  openDialog(content) {
    const dialogRef = this.dialog.open(DescDialogComponent,{data: {content:content}});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
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
