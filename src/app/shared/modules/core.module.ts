import { ComponentCommuncationService } from '../services/component-communication.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './api.service';
import { AuthService } from '../auth/auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormatPlayerTimePipe } from '../pipes/format-player-time.pipe';
import { AuthGuardService } from '../auth/auth-guard.service';
import { FormatNamePipePipe } from '../pipes/format-name-pipe.pipe';
import { FormatDurationPipe } from '../pipes/format-duration.pipe';


import { NewOrderComponent } from '../components/new-order/new-order.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderService } from '../services/order/order.service';
import { OrderModalComponent } from '../components/order-modal/order-modal.component';
import { ShortcutsModalComponent } from '../components/shortcuts-modal/shortcuts-modal.component';
import { NgUploaderModule } from 'ngx-uploader';
import { ContentEditableDirective } from '../../shared/directives/contenteditable.directive';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgUploaderModule
    ],
    exports: [
        // components that we want to make available
        // FormatPlayerTimePipe,
        // FormatNamePipePipe,
        // FormatDurationPipe,
        OrderModalComponent,
        ShortcutsModalComponent,
        // ContentEditableDirective
    ],
    declarations: [
        // FormatPlayerTimePipe,
        // FormatNamePipePipe,
        // FormatDurationPipe,
        ShortcutsModalComponent,
        OrderModalComponent,
        // ContentEditableDirective
        // components for use in THIS module
    ],
    providers: [
        // singleton services
        ComponentCommuncationService,
        AuthService,
        AuthGuardService,
        OrderService
    ],
    entryComponents: [
        OrderModalComponent,
        ShortcutsModalComponent
    ]
})
export class CoreModule { }