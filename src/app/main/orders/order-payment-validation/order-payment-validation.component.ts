import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../shared/services/order/order.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-order-payment-validation',
    templateUrl: './order-payment-validation.component.html',
    styleUrls: ['./order-payment-validation.component.scss']
})
export class OrderPaymentValidationComponent implements OnInit {


    private sub: any;
    id: number;
    public data$: Observable<any>;

    constructor(
        private orderService: OrderService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {

        // UI => display loading spinner with message: "We are currently processing your order."
        // dev => while displaying the timer, make a request to the server to check the status
        // server will respond back if the payment was succesfull or not and redirect to /payment-succesfull or /payment-failed pages

        this.sub = this.route.params.subscribe(params => {
            let id = params['order_id']; // (+) converts string 'id' to a number
            this.id = id;

            this.data$ = this.orderService.checkOrderStatus(id);

            this.data$.subscribe(
                (data) => {

                    if (data.status === "paid") {
                        alert("payment succesfull");
                        console.log("redirect to payment succesfull")
                    }

                    if (data.status === "failed") {
                        alert("payment failed");
                        console.log("redirect to payment failure page")
                    }

                },
                (error) => {
                    console.log(error);
                });


        });

    };



    ngOnDestroy() {
        this.sub.unsubscribe();
    }

}
