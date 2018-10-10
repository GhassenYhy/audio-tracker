import { OrdersComponent } from './orders/orders.component';
import { OrderPaymentGarbageComponent } from './order-payment-garbage/order-payment-garbage.component';
import { OrderPaymentValidationComponent } from './order-payment-validation/order-payment-validation.component';

export const routes = [
    {
        path: '',
        component: OrdersComponent
    },
    {
        path: 'payment/:order_id',
        component: OrderPaymentGarbageComponent
    },
    {
        path: 'payment-validation/:order_id',
        component: OrderPaymentValidationComponent
    },
];
