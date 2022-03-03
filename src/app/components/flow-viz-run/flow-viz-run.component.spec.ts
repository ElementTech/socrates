import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowvizRunComponent } from './flow-viz-run.component';

describe('FlowRunComponent', () => {
  let component: FlowvizRunComponent;
  let fixture: ComponentFixture<FlowvizRunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlowvizRunComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowvizRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
