import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders/orders.component';
import { CoreModule } from '../../shared/modules/core.module';
import { RouterModule } from '@angular/router';
import { routes } from './orders.routing';
import { OrderPaymentGarbageComponent } from './order-payment-garbage/order-payment-garbage.component';
import { MomentModule } from 'angular2-moment';
import { ToastrModule } from 'ngx-toastr';
import { NgUploaderModule } from 'ngx-uploader';
import { OrderPaymentValidationComponent } from './order-payment-validation/order-payment-validation.component';
import { PipeModule } from '../../shared/modules/pipe.module';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
        NgbModule.forRoot(),
        RouterModule.forChild(routes),
        MomentModule,
        FormsModule,
        ReactiveFormsModule,
        NgUploaderModule,
        PipeModule
    ],
    declarations: [OrdersComponent, OrderPaymentGarbageComponent, OrderPaymentValidationComponent]
})
export class OrdersModule { }
