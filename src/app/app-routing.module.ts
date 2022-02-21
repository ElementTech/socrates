import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlockCreateComponent } from './components/block-create/block-create.component';
import { BlockListComponent } from './components/block-list/block-list.component';
import { InstanceCreateComponent } from './components/instance-create/instance-create.component';
import { InstanceListComponent } from './components/instance-list/instance-list.component';
import { HomeComponent } from './components/home/home.component';
import { InstanceRunComponent } from './components/instance-run/instance-run.component';
import { SettingsComponent } from './components/settings/settings.component';
import { InstanceStatsComponent } from './components/instance-stats/instance-stats.component';
import { FlowListComponent } from './components/flow-list/flow-list.component';
import { FlowCreateComponent } from './components/flow-create/flow-create.component';
import { FlowRunComponent } from './components/flow-run/flow-run.component';
import { FlowStatsComponent } from './components/flow-stats/flow-stats.component';
import { ParametersComponent } from './components/parameters/parameters.component';
import { PortalComponent } from './components/portal/portal.component';
import { GithubListComponent } from './components/github-list/github-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuardService } from './service/auth-guard.service';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { UserListComponent } from './components/user-list/user-list.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'portal' },
  { path: 'home', component: HomeComponent },
  { path: 'portal', component: PortalComponent, canActivate: [AuthGuardService], data: {
    role: 'ROLE_USER'
  }  },

  { path: 'create-block/:id', component: BlockCreateComponent, canActivate: [AuthGuardService], data: {
    role: 'ROLE_USER'
  }  },
  { path: 'create-block',redirectTo: 'create-block/', pathMatch: 'full'},

  { path: 'create-instance/:id', component: InstanceCreateComponent, canActivate: [AuthGuardService], data: {
    role: 'ROLE_USER'
  }  },
  { path: 'create-instance', redirectTo: 'create-instance/', pathMatch: 'full'},

  { path: 'blocks-list/:name', component: BlockListComponent, canActivate: [AuthGuardService], data: {
    role: 'ROLE_USER'
  }  },
  { path: 'blocks-list',redirectTo: 'blocks-list/', pathMatch: 'full'},

  { path: 'instance-list/:name', component: InstanceListComponent, canActivate: [AuthGuardService], data: {
    role: 'ROLE_USER'
  }  },
  { path: 'instance-list',redirectTo: 'instance-list/', pathMatch: 'full'},

  { path: 'instance-run/:id', component: InstanceRunComponent, canActivate: [AuthGuardService], data: {
    role: 'ROLE_USER'
  }  },
  { path: 'instance-stats/:id', component: InstanceStatsComponent, canActivate: [AuthGuardService], data: {
    role: 'ROLE_USER'
  }  },
  { path: 'flow-stats/:id', component: FlowStatsComponent, canActivate: [AuthGuardService], data: {
    role: 'ROLE_USER'
  }  },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuardService], data: {
    role: 'ROLE_ADMIN'
  } },
  { path: 'user-list', component: UserListComponent, canActivate: [AuthGuardService], data: {
    role: 'ROLE_ADMIN'
  } },
  { path: 'github-list', component: GithubListComponent, canActivate: [AuthGuardService], data: {
    role: 'ROLE_USER'
  }  },
  { path: 'flow-list', component: FlowListComponent, canActivate: [AuthGuardService], data: {
    role: 'ROLE_USER'
  }  },
  { path: 'create-flow/:id', component: FlowCreateComponent, canActivate: [AuthGuardService], data: {
    role: 'ROLE_USER'
  }   },
  { path: 'create-flow',redirectTo: 'create-flow/', pathMatch: 'full'},
  { path: 'flow-run/:id', component: FlowRunComponent, canActivate: [AuthGuardService], data: {
    role: 'ROLE_USER'
  }  },
  { path: 'parameters', component: ParametersComponent, canActivate: [AuthGuardService], data: {
    role: 'ROLE_USER'
  }  },

  { path: 'login', component: LoginComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService], data: {
    role: 'ROLE_USER'
  } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }