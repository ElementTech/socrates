import { Component, OnInit } from '@angular/core';
import { FileElement } from '../file-manager/model/element';
import { Observable } from 'rxjs';
import { FileService } from '../file-manager/service/file.service';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.css']
})
export class PortalComponent implements OnInit {

  public fileElements: Observable<FileElement[]>;

  constructor(public fileService: FileService) {}

  currentRoot: FileElement;
  currentPath: string;
  canNavigateUp = false;

  ngOnInit() {
    const createFileList = [
      this.fileService.getAll().toPromise()
    ]
    Promise.all(createFileList).then(result=>{
      this.updateFileElementQuery();
    });
    
  }

  addFolder(folder: { name: string }) {
    const createFileList = [
      this.fileService.add({ isFolder: true, name: folder.name, parent: this.currentRoot ? this.currentRoot.id : 'root' }).toPromise()
    ]
    Promise.all(createFileList).then(result=>{
      this.updateFileElementQuery();
    });
  }

  addFile(folder: { name: string, type: string, _id: string }) {
    // let action;
    // switch (folder.type) {
    //   case "block":
    //     action = ['/create-block/', folder._id]
    //     break;
    //   case "instance":
    //     action = ['/instance-run/', folder._id]
    //     break;
    //   case "flow":
    //     action = ['/flow-run/', folder._id]
    //     break;              
    //   default:
    //     break;
    // }
    const createFileList = [
      this.fileService.add({ isFolder: false, name: folder.name, type: folder.type, fileid: folder._id, parent: this.currentRoot ? this.currentRoot.id : 'root' }).toPromise()
    ]
    Promise.all(createFileList).then(result=>{
      this.updateFileElementQuery();
    });
  }  

  removeElement(element: FileElement) {
    const createFileList = [
      this.fileService.delete(element.id).toPromise()
    ]
    Promise.all(createFileList).then(result=>{
      this.updateFileElementQuery();
    });
  }

  navigateToFolder(element: FileElement) {
    this.currentRoot = element;
    this.updateFileElementQuery();
    this.currentPath = this.pushToPath(this.currentPath, element.name);
    this.canNavigateUp = true;
  }

  navigateUp() {
    if (this.currentRoot && this.currentRoot.parent === 'root') {
      this.currentRoot = null;
      this.canNavigateUp = false;
      this.updateFileElementQuery();
    } else {
      this.fileService.get(this.currentRoot.parent).subscribe(data=>{
        this.currentRoot = data
        this.updateFileElementQuery();
      });
    }
    this.currentPath = this.popFromPath(this.currentPath);
  }

  moveElement(event: { element: FileElement; moveTo: FileElement }) {
    const createFileList = [
      this.fileService.update(event.element.id, { parent: event.moveTo.id }).toPromise(),
      this.fileService.getAll().toPromise()
    ]
    Promise.all(createFileList).then(result=>{
      this.updateFileElementQuery();
    });
  }

  renameElement(element: FileElement) {
    const createFileList = [
      this.fileService.update(element.id, { name: element.name }).toPromise(),
      this.fileService.getAll().toPromise()
    ]
    Promise.all(createFileList).then(result=>{
      this.updateFileElementQuery();
    });
  }

  updateFileElementQuery() {
    this.fileElements = this.fileService.queryInFolder(this.currentRoot ? this.currentRoot.id : 'root');
  }

  pushToPath(path: string, folderName: string) {
    let p = path ? path : '';
    p += `${folderName}/`;
    return p;
  }

  popFromPath(path: string) {
    let p = path ? path : '';
    let split = p.split('/');
    split.splice(split.length - 2, 1);
    p = split.join('/');
    return p;
  }
}
