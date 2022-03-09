import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from '../../service/file-upload.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUpload } from 'primeng/fileupload';
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;
  imageUrls = {};
  constructor(private sanitizer: DomSanitizer,private uploadService: FileUploadService) { }
  ngOnInit(): void {
    this.reloadView()
  }
  reloadView(){
    this.fileInfos = this.uploadService.getFiles();
    this.fileInfos.subscribe(data=>{
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
  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }
  downloadFile(name){
    this.uploadService.downloadFile(name)
  }
  deleteFile(name){
    if(window.confirm('Are you sure?')) {
      this.uploadService.deleteFile(name).subscribe(data=>{
        this.message = data.message
        this.reloadView()
      })
    }
  }
  progressReport($event: any) {
    this.primeFileUpload.progress = $event;
  }
  @ViewChild('primeFileUpload') primeFileUpload: FileUpload;
  upload(event): void {
    

    if (event.files) {
      const file: File | null = event.files[0];
      if (file) {
        this.currentFile = file;
        this.uploadService.upload(this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
     
              this.primeFileUpload.onProgress.emit(Math.round(100 * event.loaded / event.total));

            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.reloadView()
            }
          },
          error: (err: any) => {
            console.log(err);
            event.progress = 0;
            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }
            this.currentFile = undefined;
          }
        });
      }
      this.selectedFiles = undefined;
    }
  }
}