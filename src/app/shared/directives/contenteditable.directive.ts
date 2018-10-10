import { Directive, ElementRef, Input, Output, EventEmitter, OnChanges } from "@angular/core";

@Directive({
    selector: '[contenteditableModel]',
    host: {
        '(blur)': 'onEdit()',
        '(keyup)': 'onEdit()',
    },
    exportAs: 'word'
})

export class ContentEditableDirective implements OnChanges {
    @Input('contenteditableModel') text: any;

    @Output('contenteditableModelChange') update = new EventEmitter();

    constructor(
        private elementRef: ElementRef
    ) {
        console.log(this.text);
        console.log('ContentEditableDirective.constructor');
    }

    ngOnChanges(changes) {
        console.log('ContentEditableDirective.ngOnChanges');
        console.log(changes);
        if (changes.text.isFirstChange())
            this.refreshView();
    }

    onEdit = () => {
        console.log('ContentEditableDirective.onEdit');
        var value = this.elementRef.nativeElement.innerText;

        this.text = value;

        this.update.emit(this.text);
    }

    private refreshView() {
        console.log('ContentEditableDirective.refreshView');
        this.elementRef.nativeElement.textContent = this.text;
    }
}