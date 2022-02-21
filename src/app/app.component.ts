
import {Component, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import { SidenavService } from './service/sidenav.service';
import { AuthenticationService } from './service/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'socrates';
  opened: boolean = true;
  @ViewChild('sidenav') public sidenav: MatSidenav;
  constructor(private sidenavService: SidenavService,public auth: AuthenticationService) {
  }
  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }
}
