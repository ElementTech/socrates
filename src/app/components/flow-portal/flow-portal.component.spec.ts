import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowPortalComponent } from './flow-portal.component';

describe('FlowPortalComponent', () => {
  let component: FlowPortalComponent;
  let fixture: ComponentFixture<FlowPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlowPortalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
