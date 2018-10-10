import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPaymentValidationComponent } from './order-payment-validation.component';

describe('OrderPaymentValidationComponent', () => {
    let component: OrderPaymentValidationComponent;
    let fixture: ComponentFixture<OrderPaymentValidationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OrderPaymentValidationComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OrderPaymentValidationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
