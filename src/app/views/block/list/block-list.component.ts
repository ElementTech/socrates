import { Component, OnInit,NgZone, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import {FileUploadService} from '../../../services/file-upload.service'
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

  blocks: any[] = [];

  selectedBlocks: any = [];

  langs: any;

  statuses: any[] = [];

  loading: boolean = true;

  activityValues: number[] = [0, 100];

  githubOptions = ['true','false']

  imageUrls: any = {};

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

            const runs: any[] = []; 
       
            this.selectedBlocks.forEach((blockToDelete: { _id: { toString: () => any; }; })=>{
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

  uniq(a: any[]) {
      var seen: any = {};
      return a.filter(function(item) {
          return seen.hasOwnProperty(item) ? false : (seen[item] = true);
      });
  }

  ngOnInit() {
      this.apiService.getBlocks().subscribe(blocks => {
          this.blocks = blocks;
          console.log(blocks)
          this.loading = false;
          this.langs = Object.values(Array.from(new Set(this.uniq(this.blocks.map(block=>block.lang)).map((x) => x ?? '')))).map(x => ({ id: x, value: x}));
          this.blocks.forEach(block => block.date = new Date(block.date));
      });

      this.uploadService.getFiles().subscribe(data=>{
        data.forEach((element: { name: string | number; }) => {
          this.uploadService.getFileImage(element.name).subscribe(data => {
              let unsafeImageUrl = URL.createObjectURL(data);
              this.imageUrls[element.name]= this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
          }, error => {
              console.log(error);
          });
        });

      })
  }

}