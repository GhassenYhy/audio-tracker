import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../shared/services/order/order.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-order-payment-garbage',
    templateUrl: './order-payment-garbage.component.html',
    styleUrls: ['./order-payment-garbage.component.scss']
})
export class OrderPaymentGarbageComponent implements OnInit {

    sub: any;
    orderId: any;

    constructor(
        private route: ActivatedRoute,
        private orderService: OrderService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {

        this.sub = this.route.params.subscribe(params => {
            let id = params['order_id']; // (+) converts string 'id' to a number
            this.orderId = id;
            console.log(this.orderId);
        });


    }

    payForOrder() {
        this.orderService.setOrderStatus(this.orderId, "paid").subscribe(
            (data) => this.toastr.success("Order been paid"),
            error => this.toastr.error("Order been canceled")
        )
    }

}
