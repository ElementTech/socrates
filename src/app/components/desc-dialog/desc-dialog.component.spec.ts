import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescDialogComponent } from './desc-dialog.component';

describe('DescDialogComponent', () => {
  let component: DescDialogComponent;
  let fixture: ComponentFixture<DescDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
