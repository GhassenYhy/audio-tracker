import { RegisterComponent } from './register';
// import { InterceptorModule } from './shared/modules/interceptor.module';
import { CoreModule } from './shared/modules/core.module';
import { AccountService } from './shared/services/account';
import { MainModule } from './main';

import { LoginComponent } from './login';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranscriptReadComponent } from './transcript-read-only/transcript-read.component';
import { TranscriptsService } from '../app/main/transcripts/transcripts.service'
import { TranscriptsModule } from './main/transcripts/transcripts.module'
import { MomentModule } from 'angular2-moment';


import {
    NgModule,
    ApplicationRef
} from '@angular/core';
import {
    removeNgStyles,
    createNewHosts,
    createInputTransfer,
} from '@angularclass/hmr';
import {
    RouterModule,
    PreloadAllModules
} from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import { NoContentComponent } from './no-content';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { AuthenticationModule } from './shared';
import { ToastrModule } from 'ngx-toastr';

import '../styles/styles.scss';
import '../styles/headings.css';
import { ResetPassModule } from './resetpassword/reset-pass.module';
import { RefreshTokenService } from './shared/auth/refreshToken.service';
import { TokenInterceptor } from './shared/auth/token.interceptor';


import { CookieService } from 'ngx-cookie-service';
import { ActivationSuccessComponent } from './activation-success/activation-success.component';
import { ActivationFailedComponent } from './activation-failed/activation-failed.component';
import { PipeModule } from './shared/modules/pipe.module';

// Application wide providers
const APP_PROVIDERS = [
    ...APP_RESOLVER_PROVIDERS,
    AppState
];

type StoreType = {
    state: InternalStateType,
    restoreInputValues: () => void,
    disposeOldHosts: () => void
};


/**
 * load font
 */

// var WebFont = require('webfontloader');

// WebFont.load({
//     typekit: {
//         id: 'aqe2frk'
//     }
// });


/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        NoContentComponent,
        LoginComponent,
        RegisterComponent,
        ActivationSuccessComponent,
        ActivationFailedComponent,
        TranscriptReadComponent

    ],
    /**
     * Import Angular's modules.
     */
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        RouterModule.forRoot(ROUTES, {
            // enableTracing: true,
            useHash: Boolean(history.pushState) === false,
            preloadingStrategy: PreloadAllModules
        }),
        NgbModule.forRoot(),
        // AuthenticationModule,
        MainModule,
        ReactiveFormsModule,
        // InterceptorModule,
        ToastrModule.forRoot(),
        ResetPassModule,
        CoreModule,
        MomentModule,
        PipeModule
    ],
    /**
     * Expose our Services and Providers into Angular's dependency injection.
     */
    providers: [
        ENV_PROVIDERS,
        APP_PROVIDERS,
        AccountService,
        TranscriptsService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
    ],

})
export class AppModule {

    constructor(public appRef: ApplicationRef,
        public appState: AppState) {
    }

    public hmrOnInit(store: StoreType) {
        if (!store || !store.state) {
            return;
        }
        console.log('HMR store', JSON.stringify(store, null, 2));
        /**
         * Set state
         */
        this.appState._state = store.state;
        /**
         * Set input values
         */
        if ('restoreInputValues' in store) {
            let restoreInputValues = store.restoreInputValues;
            setTimeout(restoreInputValues);
        }

        this.appRef.tick();
        delete store.state;
        delete store.restoreInputValues;
    }

    public hmrOnDestroy(store: StoreType) {
        const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
        /**
         * Save state
         */
        const state = this.appState._state;
        store.state = state;
        /**
         * Recreate root elements
         */
        store.disposeOldHosts = createNewHosts(cmpLocation);
        /**
         * Save input values
         */
        store.restoreInputValues = createInputTransfer();
        /**
         * Remove styles
         */
        removeNgStyles();
    }

    public hmrAfterDestroy(store: StoreType) {
        /**
         * Display new elements
         */
        store.disposeOldHosts();
        delete store.disposeOldHosts;
    }

}
