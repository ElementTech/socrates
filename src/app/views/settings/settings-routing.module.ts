import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GithubListComponent } from './github/github-list.component';
import { SettingsComponent } from './settings/settings.component';
import { UserListComponent } from './users/user-list.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Settings',
    },
    children: [
      {
        path: '',
        redirectTo: 'settings',
      },
      {
        path: 'github',
        component: GithubListComponent,
        data: {
          title: 'Github',
        },
      },
      {
        path: 'settings',
        component: SettingsComponent,
        data: {
          title: 'Configure',
        },
      },
      {
        path: 'users',
        component: UserListComponent,
        data: {
          title: 'Users',
        },
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}

