import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { HttpRequest, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
    // Assuming this would be cached somehow from a login call.

    private host = HTTP_PROTOCOL + '://' + API_URL;

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
    }


    login(credentials) {
        return this.http
            .post(`${this.host}/api/auth`, credentials)
            .map(response => {

                //set access token
                this.setTokens([response["accessToken"], response["refreshToken"]]);

                return response;
            })
            .catch(err => {
                return Observable.throw(err);
            });
    };

    refresh(): Observable<any> {

        /*
             The call that goes in here will use the existing refresh token to call
             a method on the oAuth server (usually called refreshToken) to get a new
             authorization token for the API calls.
         */

        let headers = new HttpHeaders({
            "authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            "x-refresh-token": localStorage.getItem("refreshToken")
        });

        return this.http
            .post(`${this.host}/api/auth/refresh`, {}, { headers })
            .map((response) => {

                this.setTokens([response["accessToken"], response["refreshToken"]]);
                return response;

            })
            .catch(err => {
                // return err;
                return Observable.throw(err);
            });
    }


    setTokens([accessToken, refreshToken]) {

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

    }

    getAuthToken() {
        return localStorage.getItem("accessToken");
    }



    refreshToken(): Observable<Object> {

        return Observable.of(this.refresh());
    }

    logout(): Observable<any> {

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        this.router.navigate(['/login']);
        return Observable.of(this.router.navigateByUrl('/login'));

    }

    /**
     * Check, if user already authorized.
     *
     * Should return Observable with true or false values
     */
    isAuthenticated(): boolean {
        return !!this.getAuthToken()
    }


    public resetPassword(email): Observable<any> {

        // let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        // const headers = new HttpHeaders()
        //     .set('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('email', email);

        return this.http
                .post(`${this.host}/api/account/forgot_password`, {
                "email": email
            })

    }

    public setNewPassword(values): Observable<any> {

        // let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        // const headers = new HttpHeaders()
        //     .set('Content-Type', 'application/json');
        return this.http
            .post(`${this.host}/api/account/forgot_password/new`, {
                "password": values.password,
                "confirmPassword": values.confirmPassword,
                "token": values.token
            });

    }

    register(credentials) {
        console.log(credentials);
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http
            .post(`${this.host}/api/account/register`, credentials)
            .map(response => {

                return response;
            })
            .catch(err => {

                return Observable.throw(err);
            });
    };



}