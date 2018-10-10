import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../shared/modules/core.module';

import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { routes } from './settings.routing';
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [SettingsComponent]
})
export class SettingsModule { }
