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
      source: '1',
      target: '2',
      label: 'is parent of'
    },
    {
      id: 'b',
      source: '1',
      target: '3',
      label: 'custom label'
    },
    {
      id: 'c',
      source: '1',
      target: '4',
      label: 'custom label'
    }
  ];
  public nodes: Node[] = [
    {
      id: '1',
      label: 'A'
    },
    {
      id: '2',
      label: 'B'
    },
    {
      id: '3',
      label: 'C'
    },
    {
      id: '4',
      label: 'D'
    }
  ];
  ngOnInit(){
    this.nodes.forEach(node=>{
      this.nodes.push({id:`plus_${node.id}`,label:"+"})
      this.nodes = [...this.nodes];
      this.links.push({
        id:`plus_${node.id}`,
        source: node.id,
        target: `plus_${node.id}`,
        label: '+'
      })
      this.links = [...this.links];
    })
  }

  onNodeClick(event){
    console.log(event)
  }
  onNodeDblClick(event){
    console.log(event)
  }
  onPlusClick(event){
    const id = event.id.split("_").slice(1).join("_")
    const num = btoa(Math.random().toString()).substr(10, 5);

    this.nodes.push({id:`${num}_${id}`,label:num})

    this.nodes.push({id:`plus_${num}_${id}`,label:"+"})

    this.nodes = [...this.nodes];

    this.links.push({
      id:`${num}_${id}`,
      source: id,
      target: `${num}_${id}`,
      label: num
    })

    this.links.push({
      id:`plus_${num}_${id}`,
      source: `${num}_${id}`,
      target: `plus_${num}_${id}`,
      label: '+'
    })

    console.log(`Pushing Node ${num}_${id} to be connected to ${id}. Giving it plus_${num}_${id}, it will be connected to ${num}_${id}`)

    this.links = [...this.links];
  }
}