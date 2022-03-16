import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FlowVizListComponent } from './list/flow-viz-list.component';
import { FlowVizComponent } from './create/flow-viz.component';
import { FlowvizRunComponent } from './run/flow-viz-run.component';
import { FlowvizStatsComponent } from './stats/flow-viz-stats.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'DAG',
      breadcrumb: {
        info: 'sitemap'
      }
    },
    children: [
      {
        path: 'list',
        component: FlowVizListComponent,
        data: {
          title: 'List',
          breadcrumb: {
            info: 'list'
          }
        },
      },
      {
        path: 'list',
        redirectTo: '/dag/list/',
        pathMatch: 'full'
      },       
      {
        path: 'create/:id',
        component: FlowVizComponent,
        data: {
          title: 'Create',
          breadcrumb: {
            info: 'edit'
          }
        },
      },
      {
        path: 'create',
        redirectTo: '/dag/create/',
        pathMatch: 'full'
      }, 
      {
        path: 'run/:id',
        component: FlowvizRunComponent,
        data: {
          title: 'Run',
          breadcrumb: {
            info: 'play'
          }
        },
      },
      {
        path: 'stats/:id',
        component: FlowvizStatsComponent,
        data: {
          title: 'Statistics',
          breadcrumb: {
            info: 'bar-chart'
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
export class DagRoutingModule {}

