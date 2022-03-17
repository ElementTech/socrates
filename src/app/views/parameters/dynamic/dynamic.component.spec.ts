import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicParametersComponent } from './dynamic.component';

describe('DynamicParametersComponent', () => {
  let component: DynamicParametersComponent;
  let fixture: ComponentFixture<DynamicParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicParametersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
