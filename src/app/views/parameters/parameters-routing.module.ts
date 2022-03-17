import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ParametersComponent } from './shared/parameters.component';

import { DynamicParametersComponent } from './dynamic/dynamic.component';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Parameters',
      breadcrumb: {
        info: 'list-ol'
      }
    },
    children: [
      {
        path: 'shared',
        component: ParametersComponent,
        data: {
          title: 'Shared Parameters',
          breadcrumb: {
            info: 'th-list'
          }
        }
      },
      {
        path: 'dynamic',
        component: DynamicParametersComponent,
        data: {
          title: 'Dynamic Parameters',
          breadcrumb: {
            info: 'list'
          }
        }
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametersRoutingModule {
}
