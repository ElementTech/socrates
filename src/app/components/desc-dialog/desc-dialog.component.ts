import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-desc-dialog',
  templateUrl: './desc-dialog.component.html',
  styleUrls: ['./desc-dialog.component.css']
})
export class DescDialogComponent implements OnInit {
  ngOnInit(): void {
      
  }
  constructor(
    public dialogRef: MatDialogRef<DescDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

}
