import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { InstanceListComponent } from './list/instance-list.component';
import { InstanceCreateComponent } from './create/instance-create.component';
import { InstanceRunComponent } from './run/instance-run.component';
import { InstanceStatsComponent } from './stats/instance-stats.component';
import { ArtifactsComponent } from './artifacts/artifacts.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Instance',
      breadcrumb: {
        info: 'cubes'
      }
    },
    children: [
      {
        path: 'list/:name',
        component: InstanceListComponent,
        data: {
          title: 'List',
          breadcrumb: {
            info: 'list'
          }
        },
      },
      {
        path: 'list',
        redirectTo: '/instance/list/',
        pathMatch: 'full',
      },        
      {
        path: 'create/:id',
        component: InstanceCreateComponent,
        data: {
          title: 'Create',
          breadcrumb: {
            info: 'edit'
          }
        },
      },
      {
        path: 'create',
        redirectTo: '/instance/create/',
        pathMatch: 'full'
      },       
      {
        path: 'run/:id',
        component: InstanceRunComponent,
        data: {
          title: 'Run',
          breadcrumb: {
            info: 'play'
          }
        },
      },
      {
        path: 'run/:id/:run',
        component: InstanceRunComponent,
        data: {
          title: 'Run',
          breadcrumb: {
            info: 'play'
          }
        },
      },
      {
        path: 'stats/:id',
        component: InstanceStatsComponent,
        data: {
          title: 'Statistics',
          breadcrumb: {
            info: 'bar-chart'
          }
        },
      },
      {
        path: 'artifacts/:instance/:docker',
        component: ArtifactsComponent,
        data: {
          title: 'Artifacts',
          breadcrumb: {
            info: 'file'
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
export class InstanceRoutingModule {}

