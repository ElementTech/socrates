
import {Component, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import { SidenavService } from './service/sidenav.service';
import { AuthenticationService } from './service/authentication.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./menu.scss','./app.component.css']
})
export class AppComponent {
  title = 'socrates';
  @ViewChild('sidenav') public sidenav: MatSidenav;
  constructor(private sidenavService: SidenavService,public auth: AuthenticationService) {
  }
  items: MenuItem[]
  ngOnInit(){
    this.items=[
        {
            label:'Portal',
            icon:'pi pi-fw pi-users',
            routerLink:['/portal'],
            styleClass: 'menucus'
    
        },
        {
            label:'Blocks',
            icon:'pi pi-fw pi-box',
            items:[
                {
                    label:'New',
                    icon:'pi pi-fw pi-plus',
                    routerLink:['/create-block']
                },
                {
                    label:'List',
                    icon:'pi pi-fw pi-list',
                    routerLink:['/blocks-list']
                }
            ]
        },
        {
          label:'Instances',
          icon:'pi pi-fw pi-th-large',
          items:[
              {
                  label:'New',
                  icon:'pi pi-fw pi-plus',
                  routerLink:['/create-instance'],
              },
              {
                  label:'List',
                  icon:'pi pi-fw pi-list',
                  routerLink:['/instance-list']
              }
          ]
        },
        {
            label:'Flows',
            icon:'pi pi-fw pi-link',
            items:[
                {
                    label:'New',
                    icon:'pi pi-fw pi-plus',
                    items: [
                      {
                          label:'Step',
                          icon:'pi pi-fw pi-sort-amount-down',
                          routerLink:['/create-flow']
                      },
                      {
                          label:'DAG',
                          icon:'pi pi-fw pi-chevron-circle-right',
                          routerLink:['/flow-viz']
                      }
                    ]
                },
                {
                  label:'List',
                  icon:'pi pi-fw pi-list',
                  items: [
                    {
                        label:'Step',
                        icon:'pi pi-fw pi-sort-amount-down',
                        routerLink:['/flow-list']
                    },
                    {
                        label:'DAG',
                        icon:'pi pi-fw pi-chevron-circle-right',
                        routerLink:['/flow-viz-list']
                    }
                  ]
              }
            ]
        },
        {
            label:'Github',
            icon:'pi pi-fw pi-github',
            routerLink:['/github-list'],
            style: {'margin-left': 'auto'}
        },
        {
            label:this.auth.getUserDetails().name,
            icon:'pi pi-fw pi-user',
            routerLink:['/profile'],
        },
        {
            icon:'pi pi-fw pi-sign-out',
            command: () => this.auth.logout()
        }
      ]
  }

 
  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }
}
