import { Component, OnInit,NgZone, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/service/file-upload.service';
import { ApiService } from '../../service/api.service';
import { DescDialogComponent } from '../desc-dialog/desc-dialog.component';
@Component({
  selector: 'app-block-list',
  templateUrl: './block-list.component.html',
  styleUrls: ['./block-list.component.css']
})

export class BlockListComponent implements OnInit {

  Block:any;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['name', 'lang','parameters','configure'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  imageUrls = {};
  constructor(
    private sanitizer: DomSanitizer,
    private uploadService: FileUploadService,
    private router: Router,
    private ngZone: NgZone,
    private _snackBar: MatSnackBar,
    private apiService: ApiService,
    public dialog: MatDialog,
    private actRoute: ActivatedRoute) { 
    this.readBlock();

  }
  getBlock(id) {
    this.apiService.getBlock(id).subscribe(data => {
      this.Block = data;
        
    });
    
  }


  openDialog(content) {
    const dialogRef = this.dialog.open(DescDialogComponent,{data: {content:content}});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
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
 
  readBlock(){
    this.apiService.getBlocks().subscribe((data) => {
     this.Block = data;
     this.dataSource = new MatTableDataSource(this.Block.reverse());

    })    
  }
  ngAfterViewInit() {
    this.applyFilter(this.actRoute.snapshot.paramMap.get('name'))
 
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
   
    this.dataSource.filter = filterValue;
  }

  removeBlock(id) {

    if(window.confirm('Are you sure?')) {
    
        this.apiService.deleteBlock(id).subscribe(
          result => {
            // Handle result
            this.readBlock()
          },
          error => {
            if (error.includes("406"))
            {
              this._snackBar.open('Block Has Instances Attached', 'Close', {
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