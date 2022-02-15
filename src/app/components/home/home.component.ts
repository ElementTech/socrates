import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from 'src/app/service/sidenav.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(
    private sidenav: SidenavService) { }
  ngOnInit() {
  //this.sidenav.open();
  }
    
    // ngOnDestroy()
    // {
    //   this.sidenav.close();
    // }
}
