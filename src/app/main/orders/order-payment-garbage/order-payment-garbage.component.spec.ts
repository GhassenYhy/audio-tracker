import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPaymentGarbageComponent } from './order-payment-garbage.component';

describe('OrderPaymentGarbageComponent', () => {
  let component: OrderPaymentGarbageComponent;
  let fixture: ComponentFixture<OrderPaymentGarbageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPaymentGarbageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPaymentGarbageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
