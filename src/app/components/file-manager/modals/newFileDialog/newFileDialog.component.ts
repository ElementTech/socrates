import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../../service/api.service';
@Component({
  selector: 'app-newFileDialog',
  templateUrl: './newFileDialog.component.html',
  styleUrls: ['./newFileDialog.component.css']
})
export class NewFileDialogComponent implements OnInit {
  constructor(private apiService: ApiService,public dialogRef: MatDialogRef<NewFileDialogComponent>) {}

  fileName: string;
  fileType: string;
  fileID: string;
  options = [];

  ngOnInit() {}

  onValChange(value) {
    console.log(value);
    switch (value) {
      case "block":
        this.apiService.getBlocks().subscribe(data=>{
          this.options = data.map(item=>Object.assign({"name":item.name,"_id":item._id}))
        })
        break;
      case "instance":
        this.apiService.getInstances().subscribe(data=>{
          this.options = data.map(item=>Object.assign({"name":item.name,"_id":item._id}))
        })        
        break;
      case "flow":
        this.apiService.getFlows().subscribe(data=>{
          this.options = data.map(item=>Object.assign({"name":item.name,"_id":item._id}))
        })        
        break;                  
      default:
        break;
    }
  }
}
