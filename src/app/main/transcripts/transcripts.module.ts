import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranscriptsComponent } from './transcripts.component';
import { routes } from './transcripts.routing';
import { ProgressHttpModule } from "angular-progress-http";
import { HttpModule } from '@angular/http';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranscriptsService } from './transcripts.service';
import { MomentModule } from 'angular2-moment';
import { TranscriptComponent } from './transcript/transcript.component';
import { TranscriptReadComponent } from '../../transcript-read-only/transcript-read.component'
import { CoreModule } from '../../shared/modules/core.module';
import { WordEditorDirective } from '../../shared/directives/word-editor.directive';
import { NgUploaderModule } from 'ngx-uploader';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrderService } from '../../shared/services/order/order.service';
import { PipeModule } from '../../shared/modules/pipe.module';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ProgressHttpModule,
        HttpModule,
        NgbModule,
        ReactiveFormsModule,
        MomentModule,
        NgUploaderModule,
        NgxPaginationModule,
        FormsModule,
        PipeModule
    ],
    declarations: [
        TranscriptsComponent,
        TranscriptComponent,
        WordEditorDirective
    ],
    providers: [
        TranscriptsService,
        OrderService,
        NgbActiveModal
    ]
})
export class TranscriptsModule { }
