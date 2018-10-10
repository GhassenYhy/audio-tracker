import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { Routes } from '@angular/router';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';
import { ActivationSuccessComponent } from './activation-success/activation-success.component';
import { TranscriptReadComponent } from './transcript-read-only/transcript-read.component';
import { ActivationFailedComponent } from './activation-failed/activation-failed.component';

export const ROUTES: Routes = [

    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        loadChildren: './main#MainModule'
    },
    {
        path: 'forgot_password',
        loadChildren: './resetpassword#ResetPassModule',
    },
    {
        path: 'activation_succeded',
        component: ActivationSuccessComponent
    },
    {
        path: 'activation_failed',
        component: ActivationFailedComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'read/:id',
        component: TranscriptReadComponent
    },


    { path: '**', component: NoContentComponent },
];
