import { AccountService } from './services/account';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class AccountResolve implements Resolve<any> {

    constructor(private accountService: AccountService) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.accountService.getDetails();
    }
}