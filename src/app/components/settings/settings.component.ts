import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { element } from 'protractor';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {


  ELEMENT_DATA: Element[] = [];
  SettingsID: String;

  constructor(  private _snackBar: MatSnackBar,private apiService: ApiService) { }

  ngOnInit(): void {
      this.getSettings()
  }

  getSettings(){
    this.apiService.getSettings().subscribe(data=>{
      this.SettingsID = data[0]._id
      this.ELEMENT_DATA = data[0]["langs"]
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    });
  }
  displayedColumns = ['lang', 'image', 'tag', 'command','configure'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  removeLang(elem) {
    this.ELEMENT_DATA.splice(this.ELEMENT_DATA.indexOf(elem), 1)
   
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    
  }
  addLang() {
    console.log("here")
    this.ELEMENT_DATA.push({"lang":"","image":"","tag":"","command":""})
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }


  updateSettings(){
    this._snackBar.open('Settings Saved', 'Close', {
      duration: 3000
    });
    this.apiService.updateSetting(this.SettingsID,{"langs":this.ELEMENT_DATA}).subscribe(data=>{
        this.getSettings()
    });
  }

}

export interface Element {
  lang: string;
  image: string;
  tag: string;
  command: string;
}
