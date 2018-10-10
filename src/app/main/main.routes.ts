import { AccountResolve } from '../shared/account.resolve';
import { AccountService } from '../shared/services/account';
import { LoadChildren } from '@angular/router';
import { MainComponent } from './main.component';
import {
    AuthGuardService as AuthGuard
} from '../shared/auth/auth-guard.service';


export const routes = [
    {
        path: '',
        component: MainComponent,
        canActivate: [AuthGuard],
        resolve: {
            account: AccountResolve
        },
        children: [
            { path: 'files', loadChildren: 'app/main/transcripts/transcripts.module#TranscriptsModule' },
            { path: 'settings', loadChildren: 'app/main/settings/settings.module#SettingsModule' },
            { path: 'orders', loadChildren: 'app/main/orders/orders.module#OrdersModule' },
            { path: '', redirectTo: 'files', pathMatch: 'full' },
        ]
    }
];
