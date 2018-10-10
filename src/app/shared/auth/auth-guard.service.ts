import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {
    constructor(public auth: AuthService, public router: Router) { }
    canActivate(): boolean {
        if (!this.auth.isAuthenticated()) {
            this.router.navigateByUrl('/login');
            return false;
        }

        return true;
    }


    canActivateChild() {
        console.log('checking child route access');
        return true;
    }
}