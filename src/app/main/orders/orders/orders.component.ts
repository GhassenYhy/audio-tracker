import { Component, Input, OnInit, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { OrderService } from '../../../shared/services/order/order.service';
import { ToastrService } from 'ngx-toastr';
var FileSaver = require('file-saver');

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

    orders: any = [];

    stepOne;
    stepTwo;
    stepThree;
    humanizeBytes: Function;
    public orderDuration: number = 0;


    @ViewChild('browseContent') browseContent: ElementRef;


    constructor(private orderService: OrderService, private toastr: ToastrService) {
    }


    ngOnInit() {
        this.stepOne = false;
        this.stepTwo = true;
        this.stepThree = true;
        this.orderService.getOrders().subscribe(
            (data) => {
            this.orders = data;
                if (data instanceof Array) {
                    for (let i of data) {
                        i.totalDur = 0;
                        i.totalCost = 0
                        for (let j of i.orderFiles) {
                            i.totalDur += j['metadata'].durationInSeconds;
                            i.totalCost += +j['cost']
                        }
                    }
                }
                console.log(data);
            },
            (error) => console.log(error)
        )

    }

    public host = HTTP_PROTOCOL + '://' + API_URL;


    deleteSuccessToastr() {
        this.toastr.success('Order successfully cancelled !', 'Cancelled');
    }

    deleteFailToastr() {
        this.toastr.error('An error occurred while canceling your order !', 'Error');
    }


    getOrderInvoice(id) {
        this.orderService.downloadPDF(id).subscribe(
            (data) => {

                if (data) {
                    let ieEDGE = navigator.userAgent.match(/Edge/g);
                    let ie = navigator.userAgent.match(/.NET/g); // IE 11+
                    let oldIE = navigator.userAgent.match(/MSIE/g);

                    let blob = new Blob([data], { type: "application/pdf" });
                    let fileName: string = "Zoom Script Invoice - " + id + ".pdf";

                    FileSaver.saveAs(blob, fileName);

                    // if (ie || oldIE || ieEDGE) {
                    //     window.navigator.msSaveBlob(blob, fileName);
                    // }
                    // else {
                    //     let link = document.createElement('a');
                    //     link.href = window.URL.createObjectURL(blob);
                    //     link.download = fileName;
                    //     link.click();

                    //     setTimeout(function () {
                    //         window.URL.revokeObjectURL(link.href);
                    //     }, 0);
                    // }
                }
            },
            (error) => {
                this.toastr.error("Order invoice not available");
            },
            () => {
                console.log("finally");
            }
        );
    }
}
