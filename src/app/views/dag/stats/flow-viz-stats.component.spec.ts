import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowvizStatsComponent } from './flow-viz-stats.component';

describe('FlowvizStatsComponent', () => {
  let component: FlowvizStatsComponent;
  let fixture: ComponentFixture<FlowvizStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlowvizStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowvizStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
