/**
 * Angular 2 decorators and services
 */
// import { AuthenticationService } from './shared/services/authentication/authentication.service';
import { Router } from '@angular/router';
import {
    Component,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { AppState } from './app.service';

/**
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'app',
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        './app.component.css'
    ],
    templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit {
    public angularclassLogo = 'assets/img/angularclass-avatar.png';
    public name = 'Angular 2 Webpack Starter';
    public url = 'https://twitter.com/AngularClass';

    constructor(
        public appState: AppState,
        // private authService: AuthenticationService,
        private router: Router
    ) { }

    public ngOnInit() {
        console.log('Initial App State', this.appState.state);
    }

    // public logout() {
    //     this.authService.logout();
    //     this.router.navigateByUrl('/');

    // }

}
