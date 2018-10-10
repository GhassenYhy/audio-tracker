// import { TokenStorage } from './token-storage.service';
// import { TokenStorage } from '../authentication/token-storage.service';
import { URLSearchParams } from '@angular/http';
import { AuthenticationService } from '../authentication/authentication.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';

import 'rxjs/add/operator/catch';
import {
    HttpRequest,
    HttpEvent,
    HttpEventType
} from '@angular/common/http';

@Injectable()
export class OrderService {

    private authorizationHeader;
    private host = HTTP_PROTOCOL + '://' + API_URL;

    constructor(private http: HttpClient, ) {

    }

    public newOrder() {

        return this.http.post(`${this.host}/api/order/new`, {
            params: {}
        }, { withCredentials: true });

    }

    public getPaymentLink(array) {
        return this.http.post(`${this.host}/api/order/payment`, array);
    }

    public upgradeToPerfect(id) {
        return this.http.post(`${this.host}/api/order/upgrade/${id}`,{});
    }

    public getOrders() {

        return this.http
            .get(`${this.host}/api/order`);

    };

    public setOrderStatus(orderId, status) {
        return this.http
            .post(`${this.host}/api/order/status/${orderId}`, {
                status
            });
    }

    public removeFile(fileId) {
        return this.http
            .delete(`${this.host}/api/files/${fileId}`)
            .map(response => {
                return response;
            }).catch(err => {
                return Observable.throw(err);
            });
    }


    public removeOrder(orderId) {
        return this.http
            .delete(`${this.host}/api/files/${orderId}`)
            .map(response => {
                return response;
            }).catch(err => {
                return Observable.throw(err);
            });
    }

    public checkOrderStatus(orderId) {
        return this.http
            .get(`${this.host}/api/order/payment_validation?orderId=${orderId}`)
            .map(response => {
                return response;
            }).catch(err => {
                return Observable.throw(err);
            });
    }

    public downloadPDF(id) {


        const req = new HttpRequest(
            'GET',
            `${this.host}/api/order/invoice/${id}`, {
                responseType: "blob"
            });

        return this.http
            .request(req)
            .map((res: HttpResponse<{}>) => {

                if (res.type != 0) {
                    if (res.status >= 200 && res.status < 300) {
                        return res.body;
                    } else {
                        return { error: true };
                    }
                } else {
                    return false;
                };

            })
            .catch(error => {
                return Observable.throw(error)
            });

    }


}
