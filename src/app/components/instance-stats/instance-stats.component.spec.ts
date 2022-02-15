import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceStatsComponent } from './instance-stats.component';

describe('InstanceStatsComponent', () => {
  let component: InstanceStatsComponent;
  let fixture: ComponentFixture<InstanceStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstanceStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstanceStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
