import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[replaceSpaces]',
})
export class ReplaceSpacesDirective implements AfterViewInit {

    @Input('replaceBy') replaceBy: string;

    constructor(private elem: ElementRef, private input: NgControl) { }

    ngAfterViewInit() {

        const el: HTMLInputElement = this.elem.nativeElement;

        el.addEventListener('change', _ => {
            const hasValue = el.value.trim().length > 0;
            const value = el.value.trim().replace(/\s+/g, (this.replaceBy || ' '));

            this.input.control.setValue(hasValue ? value : null);

        });
    }

}
