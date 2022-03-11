import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockStatsComponent } from './block-stats.component';

describe('BlockStatsComponent', () => {
  let component: BlockStatsComponent;
  let fixture: ComponentFixture<BlockStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
