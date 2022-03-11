import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowVizListComponent } from './flow-viz-list.component';

describe('FlowVizListComponent', () => {
  let component: FlowVizListComponent;
  let fixture: ComponentFixture<FlowVizListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlowVizListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowVizListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
