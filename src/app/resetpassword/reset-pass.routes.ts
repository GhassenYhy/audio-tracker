import { LoadChildren } from '@angular/router';
import { PublicGuard, ProtectedGuard } from 'ngx-auth';
import { ResetPassComponent } from './reset-pass.component';
import { NewPasswordComponent } from './new-password/new-password.component';

export const routes = [
    {
        path: 'forgot_password',
        children: [
            {
                path: '',
                component: ResetPassComponent,
            },
            {
                path: ':token',
                component: NewPasswordComponent,
            }
        ]
    },

];
