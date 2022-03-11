import { Component } from '@angular/core';
import { IconSetService } from '@coreui/icons-angular';
import { freeSet,brandSet,flagSet } from '@coreui/icons';
import { navItems } from './_nav';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  providers:[
    AuthenticationService,
  ]
})
export class DefaultLayoutComponent {

  public navItems = navItems;

  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };

  constructor(private iconSetService: IconSetService) {
    iconSetService.icons = { ...freeSet,...brandSet,...flagSet };
  }
}
