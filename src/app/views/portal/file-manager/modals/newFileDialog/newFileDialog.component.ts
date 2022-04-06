import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-newFileDialog',
  templateUrl: './newFileDialog.component.html',
  styleUrls: ['./newFileDialog.component.css']
})
export class NewFileDialogComponent implements OnInit {
  imageUrls = {};

  constructor(
    private sanitizer: DomSanitizer,
    private uploadService: FileUploadService,private apiService: ApiService,public dialogRef: MatDialogRef<NewFileDialogComponent>) {}

  fileName: string = "";
  fileType: string = "";
  fileImage: string = "";
  fileID: {"name":string,"_id":string,"image":string} = {"name":'',"_id":'',"image":''};
  options = [];
  selected;

  
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

  displayFn(user): string {
    return user && user.name ? user.name : '';
  }


  inputChanged(event){
    if (event.option.value)
    {
      this.fileImage = this.options.find(item=>item._id==event.option.value._id).image
    }
  }

  onValChange(value) {
    console.log(value);
    switch (value) {
      case "block":
        this.apiService.getBlocks().subscribe(data=>{
          this.options = data.map(item=>Object.assign({"name":item.name,"_id":item._id,"image":item.image}))
        })
        break;
      case "instance":
        this.apiService.getInstances().subscribe(data=>{
          this.options = data.map(item=>Object.assign({"name":item.name,"_id":item._id,"image":item.image}))
        })        
        break;
      case "flow":
        this.apiService.getFlows().subscribe(data=>{
          this.options = data.map(item=>Object.assign({"name":item.name,"_id":item._id,"image":item.image}))
        })        
        break;
      case "viz":
        this.apiService.getFlowvizs().subscribe(data=>{
          this.options = data.map(item=>Object.assign({"name":item.name,"_id":item._id,"image":item.image}))
        })        
        break;                           
      default:
        break;
    }
  }
}
