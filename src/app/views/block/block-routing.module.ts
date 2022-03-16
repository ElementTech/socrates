import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { BlockListComponent } from './list/block-list.component';
import { BlockCreateComponent } from './create/block-create.component';
import { BlockStatsComponent } from './stats/block-stats.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Block',
      breadcrumb: {
        info: 'cube'
      }
    },
    children: [
      {
        path: 'list',
        component: BlockListComponent,
        data: {
          title: 'List',
          breadcrumb: {
            info: 'list'
          }
        },
      },
      {
        path: 'create/:id',
        component: BlockCreateComponent,
        data: {
          title: 'Create',
          breadcrumb: {
            info: 'edit'
          }
        },
      },
      {
        path: 'create',
        redirectTo: '/block/create/',
        pathMatch: 'full'
      },      
      {
        path: 'stats/:id',
        component: BlockStatsComponent,
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
export class BlockRoutingModule {}

