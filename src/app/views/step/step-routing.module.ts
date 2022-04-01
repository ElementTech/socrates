import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { FlowListComponent } from './list/flow-list.component';
import { FlowCreateComponent } from './create/flow-create.component';
import { FlowRunComponent } from './run/flow-run.component';
import { FlowStatsComponent } from './stats/flow-stats.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Step',
      breadcrumb: {
        info: 'stairs'
      }
    },
    children: [
      {
        path: 'list/:name',
        component: FlowListComponent,
        data: {
          title: 'List',
          breadcrumb: {
            info: 'list'
          }
        },
      },
      {
        path: 'list',
        redirectTo: '/step/list/',
        pathMatch: 'full'
      },        
      {
        path: 'create/:id',
        component: FlowCreateComponent,
        data: {
          title: 'Create',
          breadcrumb: {
            info: 'edit'
          }
        },
      },
      {
        path: 'create',
        redirectTo: '/step/create/',
        pathMatch: 'full'
      },        
      {
        path: 'run/:id',
        component: FlowRunComponent,
        data: {
          title: 'Run',
          breadcrumb: {
            info: 'play'
          }
        },
      },
      {
        path: 'run/:id/:run',
        component: FlowRunComponent,
        data: {
          title: 'Run',
          breadcrumb: {
            info: 'play'
          }
        },
      },
      {
        path: 'stats/:id',
        component: FlowStatsComponent,
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
export class StepRoutingModule {}

