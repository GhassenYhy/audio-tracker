import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent, SafePipe } from './home.component';
import { routes } from './home.routing';

import * as hljs from 'highlight.js';
import { HighlightJsModule, HIGHLIGHT_JS } from 'angular-highlight-js';
export function highlightJsFactory() {
    return hljs;
}


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        HighlightJsModule.forRoot({
            provide: HIGHLIGHT_JS,
            useFactory: highlightJsFactory
        })
    ],
    declarations: [
        HomeComponent,
        SafePipe
    ]
})
export class HomeModule { }
