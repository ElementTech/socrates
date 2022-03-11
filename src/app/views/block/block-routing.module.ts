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
    },
    children: [
      {
        path: 'list',
        component: BlockListComponent,
        data: {
          title: 'List',
        },
      },
      {
        path: 'create/:id',
        component: BlockCreateComponent,
        data: {
          title: 'Create',
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

