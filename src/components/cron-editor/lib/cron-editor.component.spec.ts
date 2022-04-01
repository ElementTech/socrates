import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CronEditorComponent } from './cron-editor.component';

describe('CronEditorComponent', () => {
  let component: CronEditorComponent;
  let fixture: ComponentFixture<CronEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CronEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CronEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
