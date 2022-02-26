import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowVizComponent } from './flow-viz.component';

describe('FlowVizComponent', () => {
  let component: FlowVizComponent;
  let fixture: ComponentFixture<FlowVizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlowVizComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowVizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
