import { Component, Input ,NgZone} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  providers: [AuthenticationService]
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  constructor(private classToggler: ClassToggleService,public auth: AuthenticationService,
    private router: Router,
    private ngZone: NgZone,) {
    super();
  }

  logout()
  {
    this.auth.logout()
    this.ngZone.run(() => this.router.navigateByUrl('/login'))
  }
}
