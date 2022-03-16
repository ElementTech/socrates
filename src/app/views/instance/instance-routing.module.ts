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
    },
    children: [
      {
        path: 'list/:name',
        component: InstanceListComponent,
        data: {
          title: 'List',
        },
      },
      {
        path: 'list',
        redirectTo: '/instance/list/',
        pathMatch: 'full'
      },        
      {
        path: 'create/:id',
        component: InstanceCreateComponent,
        data: {
          title: 'Create',
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
        },
      },
      {
        path: 'run/:id/:run',
        component: InstanceRunComponent,
        data: {
          title: 'Run',
        },
      },
      {
        path: 'stats/:id',
        component: InstanceStatsComponent,
        data: {
          title: 'Statistics',
        },
      },
      {
        path: 'artifacts/:instance/:docker',
        component: ArtifactsComponent,
        data: {
          title: 'Artifacts',
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

