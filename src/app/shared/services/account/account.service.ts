// import { TokenStorage } from './token-storage.service';
// import { TokenStorage } from '../authentication/token-storage.service';
import { URLSearchParams } from '@angular/http';
import { AuthenticationService } from '../authentication/authentication.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';

import 'rxjs/add/operator/catch';

@Injectable()
export class AccountService {

    private authorizationHeader;
    private host = HTTP_PROTOCOL + '://' + API_URL;

    constructor(
        private http: HttpClient,
        // private authService: AuthenticationService,
        // private tokenStorage: TokenStorage
    ) { }

    public getDetails() {
        return this.http
            .get(`${this.host}/api/account`);
    }


    public getUsage(startDate?, endDate?) {

        let headers = new HttpHeaders().set('Content-Type', "application/json");

        return this.http
            .get(`${this.host}/api/account/usage`);

    };

    public updateContactDetails(formData) {
        return this.http
            .post(`${this.host}/api/account/update`, {
                'lastName': formData.lastName,
                'firstName': formData.firstName,
            });
    }


    public updateBillingDetails(formData) {
        return this.http
            .post(`${this.host}/api/account/billing`, {
                'lastName': formData.lastName,
                'firstName': formData.firstName,
                'city': formData.city,
                'country': formData.country,
                'street': formData.street,
                'email': formData.email
            });
    }

};
