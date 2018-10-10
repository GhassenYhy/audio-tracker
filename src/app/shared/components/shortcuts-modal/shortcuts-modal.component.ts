import { Component, OnInit, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'bc-shortcuts-modal',
    templateUrl: './shortcuts-modal.component.html',
    styleUrls: ['./shortcuts-modal.component.css']
})
export class ShortcutsModalComponent implements OnInit {


    constructor(public activeModal: NgbActiveModal) {
    }

    ngOnInit() {
    }


}
