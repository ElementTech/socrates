import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SchedulerComponent } from './list/scheduler.component';
import { TimelineComponent } from './timeline/timeline.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Scheduler',
      breadcrumb: {
        info: 'calendar'
      }
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
      },
      {
        path: 'list',
        component: SchedulerComponent,
        data: {
          title: 'List',
          breadcrumb: {
            info: 'list'
          },
          role: 'ROLE_USER'
        },
      },
      {
        path: 'timeline',
        component: TimelineComponent,
        data: {
          title: 'Timeline',
          breadcrumb: {
            info: 'chart-line'
          }
        },
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulerRoutingModule {
}
