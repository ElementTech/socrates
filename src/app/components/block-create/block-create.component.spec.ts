import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockCreateComponent } from './block-create.component';

describe('BlockCreateComponent', () => {
  let component: BlockCreateComponent;
  let fixture: ComponentFixture<BlockCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
