import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ArtifactUploadService } from '../../../services/artifact-upload.service'
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-artifacts',
  templateUrl: './artifacts.component.html',
  styleUrls: ['./artifacts.component.css']
})
export class ArtifactsComponent implements OnInit {
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;
  imageUrls = {};
  instance: any;
  docker: any;
  constructor(private sanitizer: DomSanitizer,private actRoute: ActivatedRoute,private uploadService: ArtifactUploadService) { }
  ngOnInit(): void {
    this.instance = this.actRoute.snapshot.paramMap.get('instance')
    this.docker = this.actRoute.snapshot.paramMap.get('docker')
    this.reloadView()
  }
  reloadView(){
    this.fileInfos = this.uploadService.getFiles(this.instance,this.docker);
  }
  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }
  downloadFile(name){
    this.uploadService.downloadFile(this.instance,this.docker,name)
  }
  deleteFile(name){
    if(window.confirm('Are you sure?')) {
      this.uploadService.deleteFile(this.instance,this.docker,name).subscribe(data=>{
        this.message = data.message
        this.reloadView()
      })
    }
  }

  upload(): void {
    this.progress = 0;
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFile = file;
        this.uploadService.upload(this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.reloadView()
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;
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