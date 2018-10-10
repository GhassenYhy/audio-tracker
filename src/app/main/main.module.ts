import { SettingsModule } from './home/settings';
import { UsageModule } from './usage';
import { HomeModule } from './home';
import { CoreModule } from '../shared/modules/core.module';
import { AccountResolve } from '../shared/account.resolve';
import { AccountService } from '../shared/services/account';
import { NgbModule, NgbDropdownModule, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { MainComponent } from './main.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routes } from './main.routes';
import { MomentModule } from 'angular2-moment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgUploaderModule } from 'ngx-uploader';




const host = HTTP_PROTOCOL + '://' + API_URL;



@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgbModule,
        CoreModule,
        MomentModule,
        FormsModule,
        ReactiveFormsModule,
        NgUploaderModule
    ],
    declarations: [
        MainComponent
    ],
    providers: [
        AccountService,
        AccountResolve,
        NgbDropdown
    ]
})
export class MainModule {
    public static routes = routes;
}
