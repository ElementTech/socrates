import { Component } from '@angular/core';
import { Layout, Edge, Node } from '@swimlane/ngx-graph';
import { DagreNodesOnlyLayout } from './customDagreNodesOnly';
import { stepRound } from './customStepCurved';

@Component({
  selector: 'flow-viz',
  styleUrls: ['./flow-viz.component.css'],
  templateUrl: './flow-viz.component.html'
})
export class FlowVizComponent {
  public curve: any = stepRound;
  public layout: Layout = new DagreNodesOnlyLayout();
  public links: Edge[] = [
    {
      id: 'a',
      source: 'first',
      target: 'second',
      label: 'is parent of'
    },
    {
      id: 'b',
      source: 'first',
      target: 'third',
      label: 'custom label'
    },
    {
      id: 'c',
      source: 'first',
      target: 'fourth',
      label: 'custom label'
    }
  ];
  public nodes: Node[] = [
    {
      id: 'first',
      label: 'A'
    },
    {
      id: 'second',
      label: 'B'
    },
    {
      id: 'third',
      label: 'C'
    },
    {
      id: 'fourth',
      label: 'D'
    }
  ];
}