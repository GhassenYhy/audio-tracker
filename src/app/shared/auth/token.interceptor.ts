import { Injectable, Injector } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
    HttpSentEvent,
    HttpHeaderResponse,
    HttpProgressEvent,
    HttpResponse,
    HttpUserEvent
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    isRefreshingToken: boolean = false;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(
        private inj: Injector,
        private router: Router) { }

    intercept(
        request: HttpRequest<any>,
        // next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
        next: HttpHandler): Observable<any> {

        const auth = this.inj.get(AuthService);
        const authToken = auth.getAuthToken();

        request = request.clone({
            withCredentials: true
        });

        return next
            .handle(this.addToken(request, authToken))
            .catch((error) => {

                if (error.status) {
                    if (error.status == 403) {
                        this.logoutUser();
                        this.router.navigateByUrl('/login');
                        return Observable.throw(error.error);
                    }

                    return Observable.throw(error.error);
                } else {
                    this.logoutUser();
                    return Observable.throw({
                        error: "Server unreachable"
                    });
                }


            });



    }

    addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
        return req.clone()
    }

    logoutUser() {
        // Route to the login page (implementation up to you)
        const auth = this.inj.get(AuthService);
        return auth.logout();


    }

}