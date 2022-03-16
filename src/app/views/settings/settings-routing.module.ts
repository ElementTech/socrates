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
      breadcrumb: {
        info: 'cog'
      }
    },
    children: [
      {
        path: '',
        redirectTo: 'configure',
      },
      {
        path: 'github',
        component: GithubListComponent,
        data: {
          title: 'Github',
          breadcrumb: {
            info: 'github'
          }
        },
      },
      {
        path: 'configure',
        component: SettingsComponent,
        data: {
          title: 'Configure',
          breadcrumb: {
            info: 'edit'
          }
        },
      },
      {
        path: 'users',
        component: UserListComponent,
        data: {
          title: 'Users',
          breadcrumb: {
            info: 'users'
          }
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

