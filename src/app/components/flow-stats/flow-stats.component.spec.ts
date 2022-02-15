import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowStatsComponent } from './flow-stats.component';

describe('FlowStatsComponent', () => {
  let component: FlowStatsComponent;
  let fixture: ComponentFixture<FlowStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlowStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
