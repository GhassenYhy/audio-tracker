import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptReadComponent } from './transcript-read.component';

describe('TranscriptComponent', () => {
  let component: TranscriptReadComponent;
  let fixture: ComponentFixture<TranscriptReadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranscriptReadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranscriptReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
