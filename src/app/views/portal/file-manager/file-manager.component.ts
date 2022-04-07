import { Component, Input, OnChanges, SimpleChanges, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { FileElement } from './model/element';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { NewFolderDialogComponent } from './modals/newFolderDialog/newFolderDialog.component';
import { RenameDialogComponent } from './modals/renameDialog/renameDialog.component';
import { NewFileDialogComponent } from './modals/newFileDialog/newFileDialog.component';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUploadService } from 'src/app/services/file-upload.service';
import {MenuItem} from 'primeng/api';
@Component({
  selector: 'file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css'],
  providers: [FileUploadService]
})
export class FileManagerComponent implements OnChanges {
  
  imageUrls = {};

  constructor(
    private sanitizer: DomSanitizer,
    private uploadService: FileUploadService,
    public dialog: MatDialog
  ) {}

  @Input() fileElements: FileElement[];
  @Input() canNavigateUp: string;
  @Input() path: string;

  @Output() folderAdded = new EventEmitter<{ name: string }>();
  @Output() fileAdded = new EventEmitter<{ name: string, type: string, _id: string, image:string }>();
  @Output() elementRemoved = new EventEmitter<FileElement>();
  @Output() elementRenamed = new EventEmitter<FileElement>();
  @Output() navigatedDown = new EventEmitter<FileElement>();
  @Output() elementMoved = new EventEmitter<{ element: FileElement; moveTo: FileElement }>();
  @Output() navigatedUp = new EventEmitter();

  chartOptions = {
    plugins: {
      legend: {
          display: false
      }
    },
    animation: {
      duration: 0
    },
    events: [],
    tooltips: {
      enabled: false
    },
    maintainAspectRatio: false,
    scales: {
      y: {
        stacked: true,
        ticks: {
          display: false
        },
        grid: {
          display: false,
          drawBorder: false
        }
      },
      x: {
        stacked: true,
        ticks: {
          display: false
        },
        grid: {
          display: false,
          drawBorder: false
        }
      }
    }
  }



  ngOnInit() {

    
    this.setColumns();
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

  ngOnChanges(changes: SimpleChanges): void {}

  deleteElement(element: FileElement) {
    if (window.confirm("Are you sure?"))
    {
      this.elementRemoved.emit(element);
    }
  }

  navigate(element: FileElement) {
    if (element.isFolder) {
      this.navigatedDown.emit(element);
    }
  }

  navigateUp() {
    this.navigatedUp.emit();
  }

  moveElement(element: FileElement, moveTo: FileElement) {
    this.elementMoved.emit({ element: element, moveTo: moveTo });
  }

  openNewFolderDialog() {
    let dialogRef = this.dialog.open(NewFolderDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.folderAdded.emit({ name: res });
      }
    });
  }

  openNewFileDialog() {
    let dialogRef = this.dialog.open(NewFileDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.fileAdded.emit({ name: res.name, type: res.type, _id: res._id, image: res.image });
      }
    });
  }  

  openRenameDialog(element: FileElement) {
    let dialogRef = this.dialog.open(RenameDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        element.name = res;
        this.elementRenamed.emit(element);
      }
    });
  }

  openMenu(event: MouseEvent, element: FileElement, viewChild: MatMenuTrigger) {
    event.preventDefault();
    viewChild.openMenu();
  }

  @ViewChild('box', {static: true}) box: ElementRef;
  columns: number = 8;
  setColumns() {
    this.columns = Math.floor(this.box.nativeElement.clientWidth / 200);
  } 
}
