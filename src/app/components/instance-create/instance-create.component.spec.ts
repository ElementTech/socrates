import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceCreateComponent } from './instance-create.component';

describe('InstanceCreateComponent', () => {
  let component: InstanceCreateComponent;
  let fixture: ComponentFixture<InstanceCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstanceCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstanceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
