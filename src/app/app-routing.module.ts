import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers';
import { Page404Component } from './views/pages/page404/page404.component';
import { Page500Component } from './views/pages/page500/page500.component';
import { LoginComponent } from './views/pages/login/login.component';
import { RegisterComponent } from './views/pages/register/register.component';
import { AuthGuardService } from './services/auth-guard.service';
import { UnauthorizedComponent } from './views/pages/unauthorized/unauthorized.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'portal',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home',
      role: 'ROLE_USER'
    },
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'parameters',
        loadChildren: () =>
          import('./views/parameters/parameters.module').then((m) => m.ParametersModule)
      },
      {
        path: 'icons',
        loadChildren: () =>
          import('./views/icons/icons.module').then((m) => m.IconsModule)
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./views/profile/profile.module').then((m) => m.ProfileModule)
      },
      {
        path: 'portal',
        loadChildren: () =>
          import('./views/portal/portal.module').then((m) => m.PortalModule)
      },
      {
        path: 'block',
        loadChildren: () =>
          import('./views/block/block.module').then((m) => m.BlockModule)
      },
      {
        path: 'instance',
        loadChildren: () =>
          import('./views/instance/instance.module').then((m) => m.InstanceModule)
      },
      {
        path: 'dag',
        loadChildren: () =>
          import('./views/dag/dag.module').then((m) => m.DagModule)
      },
      {
        path: 'step',
        loadChildren: () =>
          import('./views/step/step.module').then((m) => m.StepModule)
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./views/pages/pages.module').then((m) => m.PagesModule)
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./views/settings/settings.module').then((m) => m.SettingsModule),
        data: {
          role: 'ROLE_ADMIN'
        },
        canActivate: [AuthGuardService],
      },
    ]
  },
  {
    path: '404',
    component: Page404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
    data: {
      title: 'Page 403'
    }
  },
  {
    path: '500',
    component: Page500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page',
    },
  },
  {path: '**', redirectTo: '404'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking'
      // relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
