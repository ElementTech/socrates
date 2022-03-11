import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceRunComponent } from './instance-run.component';

describe('InstanceRunComponent', () => {
  let component: InstanceRunComponent;
  let fixture: ComponentFixture<InstanceRunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstanceRunComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstanceRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
