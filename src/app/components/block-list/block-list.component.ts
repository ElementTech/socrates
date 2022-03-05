import { Component, OnInit,NgZone, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { FileUploadService } from 'src/app/service/file-upload.service';
import { ApiService } from '../../service/api.service';
import { DescDialogComponent } from '../desc-dialog/desc-dialog.component';
import { Table } from 'primeng/table';
import { PrimeNGConfig } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-block-list',
  templateUrl: './block-list.component.html',
  styleUrls: ['./block-list.component.scss'],
  providers: [MessageService,ConfirmationService]
})

export class BlockListComponent implements OnInit {

  // Block:any;
  // dataSource: MatTableDataSource<any>;
  // displayedColumns = ['name', 'lang','parameters','configure'];
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort, { static: true }) sort: MatSort;
  // imageUrls = {};
  // constructor(
  //   private sanitizer: DomSanitizer,
  //   private uploadService: FileUploadService,
  //   private router: Router,
  //   private ngZone: NgZone,
  //   private _snackBar: MatSnackBar,
  //   private apiService: ApiService,
  //   public dialog: MatDialog,
  //   private actRoute: ActivatedRoute) { 
  //   this.readBlock();

  // }
  // getBlock(id) {
  //   this.apiService.getBlock(id).subscribe(data => {
  //     this.Block = data;
        
  //   });
    
  // }


  // openDialog(content) {
  //   const dialogRef = this.dialog.open(DescDialogComponent,{data: {content:content}});

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`Dialog result: ${result}`);
  //   });
  // }


  // ngOnInit() {
  //   this.uploadService.getFiles().subscribe(data=>{
  //     data.forEach(element => {
  //       this.uploadService.getFileImage(element.name).subscribe(data => {
  //           let unsafeImageUrl = URL.createObjectURL(data);
  //           this.imageUrls[element.name]= this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
  //       }, error => {
  //           console.log(error);
  //       });
  //     });

  //   })
  // }
  //  //rest of your code..
 
  // readBlock(){
  //   this.apiService.getBlocks().subscribe((data) => {
  //    this.Block = data;
  //    this.dataSource = new MatTableDataSource(this.Block.reverse());

  //   })    
  // }
  // ngAfterViewInit() {
  //   this.applyFilter(this.actRoute.snapshot.paramMap.get('name'))
 
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }

  // applyFilter(filterValue: string) {
  //   filterValue = filterValue.trim(); // Remove whitespace
  //   filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
   
  //   this.dataSource.filter = filterValue;
  // }

  // removeBlock(id) {

  //   if(window.confirm('Are you sure?')) {
    
  //       this.apiService.deleteBlock(id).subscribe(
  //         result => {
  //           // Handle result
  //           this.readBlock()
  //         },
  //         error => {
  //           if (error.includes("406"))
  //           {
  //             this._snackBar.open('Block Has Instances Attached', 'Close', {
  //               duration: 3000
  //             });
  //           }
  //         },
  //         () => {
  //           // 'onCompleted' callback.
  //           // No errors, route to new page here
  //         }
  //       );
   
  //   }
 
    
  // }

  blocks: any[];

  selectedBlocks: any[];

  langs: any;

  statuses: any[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];

  githubOptions = ['true','false']

  imageUrls = {};

  constructor(
    private apiService: ApiService,
    private uploadService: FileUploadService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) { }

  deleteSelectedBlocks() {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected products?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {

            const runs = []; 
       
            this.selectedBlocks.forEach(blockToDelete=>{
              runs.push(this.apiService.deleteBlock(blockToDelete._id.toString()).toPromise());
            });
            Promise.allSettled(runs).then(promiseResult => {
              console.log(promiseResult)
              if (promiseResult.map(res=>res.status).includes("rejected") && promiseResult.map(res=>res.status).includes("fulfilled"))
              {
                this.messageService.add({severity:'warn', summary: 'Warning', detail: 'Some Blocks have Instances Attached. Deleted Unattached.', life: 3000});
              }
              if (!promiseResult.map(res=>res.status).includes("rejected"))
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Blocks Deleted', life: 3000});
              }
              if (!promiseResult.map(res=>res.status).includes("fulfilled"))
              {
                this.messageService.add({severity:'error', summary: 'Error', detail: 'All Blocks chosen have Instances attached', life: 3000});
              }
              promiseResult.filter(res=>res.status=="fulfilled").forEach(toRemove=>{
                console.log(toRemove)
                // @ts-ignore
                if (Object.keys(toRemove).includes('msg'))
                {
                  console.log("first")
                  // @ts-ignore
                  this.blocks = this.blocks.filter(val => val._id!=toRemove.msg._id);
                }
                // @ts-ignore
                if (Object.keys(toRemove).includes('value'))
                {
                  console.log("second")
                  // @ts-ignore
                  this.blocks = this.blocks.filter(val => val._id!=toRemove.value.msg._id);
                }
              })
   
            }) 

            this.selectedBlocks = null
       
        }
    });
}

  uniq(a) {
      var seen = {};
      return a.filter(function(item) {
          return seen.hasOwnProperty(item) ? false : (seen[item] = true);
      });
  }

  ngOnInit() {
      this.apiService.getBlocks().subscribe(blocks => {
          this.blocks = blocks;
          this.loading = false;
          this.langs = Object.values(Array.from(new Set(this.uniq(this.blocks.map(block=>block.lang)).map((x) => x ?? '')))).map(x => ({ id: x, value: x}));
          this.blocks.forEach(block => block.date = new Date(block.date));
      });

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

     

      this.statuses = [
          {label: 'Unqualified', value: 'unqualified'},
          {label: 'Qualified', value: 'qualified'},
          {label: 'New', value: 'new'},
          {label: 'Negotiation', value: 'negotiation'},
          {label: 'Renewal', value: 'renewal'},
          {label: 'Proposal', value: 'proposal'}
      ]
  }

}