import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ParametersComponent } from './parameters.component';

const routes: Routes = [
  {
    path: '',
    component: ParametersComponent,
    data: {
      title: $localize`Parameters`,
      breadcrumb: {
        info: 'th-list'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametersRoutingModule {
}
