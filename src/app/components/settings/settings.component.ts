import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { element } from 'protractor';
import { interval } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  githubURL = ""
  githubBranch = "main"
  hide = true;

  githubWebhook = true
  githubToken = ""
  githubConnected = false
  ELEMENT_DATA: Element[] = [];
  SettingsID: String;
  socratesURL = window.location.protocol + "//" + window.location.host
  sha: any;
  constructor(  private _snackBar: MatSnackBar,private apiService: ApiService) { }
  progressbarValue = 0;
  ngOnInit(): void {
      this.getSettings()
  }

  curSec: number = 0;

  startTimer(seconds: number) {
    this.progressbarValue = 0;
    const time = seconds;
    const timer$ = interval(10);

    const sub = timer$.subscribe((sec) => {
      this.progressbarValue = 100 + sec * 100 / seconds;
      this.curSec = sec;

      if (this.curSec === seconds) {
        sub.unsubscribe();
      }
    });
  }
  downTimer(seconds: number) {
    this.progressbarValue = 100;
    const time = seconds;
    const timer$ = interval(10);

    const sub = timer$.subscribe((sec) => {
      this.progressbarValue = 0 - sec * 100 / seconds;
      this.curSec = sec;

      if (this.curSec === seconds) {
        sub.unsubscribe();
      }
    });
  }

  getSettings(){
    this.apiService.getSettings().subscribe(data=>{
      this.SettingsID = data[0]._id
      this.ELEMENT_DATA = data[0]["langs"]
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.githubURL = data[0].github[0].githubURL
      this.githubBranch = data[0].github[0].githubBranch
      this.githubWebhook = data[0].github[0].githubWebhook
      this.githubConnected = data[0].github[0].githubConnected
      this.sha = data[0].github[0].sha
      this.githubToken = data[0].github[0].githubToken
      if (data[0].github[0].githubConnected){
        this.startTimer(60)
      }
      else
      {
        this.downTimer(60)
      }
    });
  }
  displayedColumns = ['lang', 'image', 'tag', 'command','type','configure'];
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
    this.ELEMENT_DATA.push({"lang":"","image":"","tag":"","command":"","type":""})
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }


  updateSettings(){

    // ,"github": {"githubURL":this.githubURL,"githubBranch":this.githubBranch,"githubWebhook":this.githubWebhook}}
    if (this.ELEMENT_DATA.every(i => Object.values(i).every(v => v)))
    {
      this.apiService.updateSetting(this.SettingsID,{"langs":this.ELEMENT_DATA}).subscribe(data=>{
        this.getSettings()
        this._snackBar.open('Languages Saved', 'Close', {
          duration: 3000
        });
    });
    }
    else
    {
      this._snackBar.open('Fields Cannot be empty', 'Close', {
        duration: 3000
      });
    }
  
  }

  connectGithub(){
    const regex = /^(((https?\:\/\/)(((([a-zA-Z0-9][a-zA-Z0-9\-\_]{1,252})\.){1,8}[a-zA-Z]{2,63})\/))|((ssh\:\/\/)?git\@)(((([a-zA-Z0-9][a-zA-Z0-9\-\_]{1,252})\.){1,8}[a-zA-Z]{2,63})(\:)))([a-zA-Z0-9][a-zA-Z0-9\_\-]{1,36})(\/)([a-zA-Z0-9][a-zA-Z0-9\_\-]{1,36})((\.git)?)$/g;
    if (this.githubBranch != ""){
      console.log(this.githubURL)
      if (!("https://github.com/"+this.githubURL+".git").match(regex)){
        this._snackBar.open('Github Repository Must be a valid Repository URL', 'Close', {
          duration: 3000
        });
      }
      else
      {
        this.apiService.updateSetting(this.SettingsID,{"github": {"githubToken":this.githubToken,"githubURL":this.githubURL,"githubBranch":this.githubBranch,"githubWebhook":this.githubWebhook,"githubConnected": true}}).subscribe(data=>{
          this._snackBar.open(data, 'Close', {
            duration: 3000
          });
          this.getSettings()

        });
      }
    }
    else
    {
      this._snackBar.open('You Must Specify a Github Branch to Watch', 'Close', {
        duration: 3000
      });
    }

 
  }
  disconnectGithub(){
    this._snackBar.open('Github Connection Detached', 'Close', {
      duration: 3000
    });
    this.apiService.updateSetting(this.SettingsID,{"github": {"githubURL":"","sha":"","githubBranch":"","githubWebhook":false,"githubConnected": false}}).subscribe(data=>{
      this.githubURL = ""
      this.githubBranch = ""
      this.githubWebhook = false
      this.githubConnected = false
      this.getSettings()
  });
  }


}

export interface Element {
  lang: string;
  image: string;
  tag: string;
  command: string;
  type: string;
}
