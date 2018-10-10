import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivationFailedComponent } from './activation-failed.component';

describe('ActivationFailedComponent', () => {
  let component: ActivationFailedComponent;
  let fixture: ComponentFixture<ActivationFailedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivationFailedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivationFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
