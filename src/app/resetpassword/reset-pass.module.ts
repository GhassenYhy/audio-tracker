import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routes } from './reset-pass.routes';
import { ResetPassComponent } from './reset-pass.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewPasswordComponent } from './new-password/new-password.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        ResetPassComponent,
        NewPasswordComponent
    ],
    providers: [

    ]
})
export class ResetPassModule {
    public static routes = routes;
}
