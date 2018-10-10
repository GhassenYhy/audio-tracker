import { Directive, Input, Output, EventEmitter, ElementRef } from '@angular/core';

@Directive({
    selector: '[appWordEditor]'
})
export class WordEditorDirective {

    @Input('appWordEditor') results: any;

    @Output('appWordEditorChange') update = new EventEmitter();

    constructor(
        private elementRef: ElementRef
    ) {
        console.log(this.results);
        console.log('appWordEditor.constructor');
    }

    ngOnChanges(changes) {
        console.log('appWordEditor.ngOnChanges');
        if (changes.results.isFirstChange())
            this.refreshView();
    }

    onEdit = () => {
        console.log('appWordEditor.onEdit');
        var value = this.elementRef.nativeElement.innerText;

        this.results = value;

        this.update.emit(this.results);
    }

    private refreshView() {
        console.log('appWordEditor.refreshView');
        this.elementRef.nativeElement.textContent = this.results.map(item => item.word).join(" ");
    }

}
