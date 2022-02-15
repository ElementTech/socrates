import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowRunComponent } from './flow-run.component';

describe('FlowRunComponent', () => {
  let component: FlowRunComponent;
  let fixture: ComponentFixture<FlowRunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlowRunComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
