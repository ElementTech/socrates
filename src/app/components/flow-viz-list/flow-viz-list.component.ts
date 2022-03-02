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
  selector: 'app-flow-viz-list',
  templateUrl: './flow-viz-list.component.html',
  styleUrls: ['./flow-viz-list.component.css']
})
export class FlowVizListComponent implements OnInit {

  FlowViz:any;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['run','name','nodes','configure'];
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
    this.readFlowViz();

  }
  getFlowViz(id) {
    this.apiService.getFlowviz(id).subscribe(data => {
      
      this.FlowViz = data;
        
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
 
  readFlowViz(){
    this.apiService.getFlowvizs().subscribe((data) => {
     this.FlowViz = data;
     
     this.dataSource = new MatTableDataSource(this.fetchLastBuild(this.FlowViz)); //
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

  removeFlowviz(id) {

    if(window.confirm('Are you sure?')) {
    
        this.apiService.deleteFlowviz(id).subscribe((data) => {
          this.readFlowViz();
       
        })    
    }  
  }

  fetchLastBuild(thisInstance) {
  
    for (let index = 0; index < thisInstance.length; index++) {
      const element = thisInstance[index];
      this.apiService.getFlowvizInstanceByFlowvizID(element._id).subscribe(data => {
      
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
