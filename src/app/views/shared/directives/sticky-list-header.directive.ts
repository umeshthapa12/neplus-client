import { AfterViewInit, Directive, ElementRef, OnDestroy, Input, Renderer2 } from '@angular/core';
import { fromEvent, Subject, merge } from 'rxjs';
import { debounceTime, filter, map, takeUntil, tap } from 'rxjs/operators';

@Directive({
    selector: '[list-sticky-header]',
})
export class ListStickyHeaderDirective implements AfterViewInit, OnDestroy {

    private toDestory$ = new Subject<void>();

    @Input() hideStickyDone = false;

    constructor(
        private elem: ElementRef,
        private renderer: Renderer2
    ) { }

    ngAfterViewInit() {

        this.initDefaultElementStyles(this.elem.nativeElement);

        this.addRemoveBoxShadowToStickyHeader(this.elem.nativeElement);

    }

    private initDefaultElementStyles(el: HTMLElement) {
        if (el) {
            el.classList.add('sticky-header');
        }
    }

    ngOnDestroy() {
        this.toDestory$.next();
        this.toDestory$.complete();
        this.elem = null;
    }

    private addRemoveBoxShadowToStickyHeader(el: HTMLElement) {

        if (this.hideStickyDone) {
            this.renderer.addClass(el, 'sticky-header-hide');
        }

        fromEvent(window, 'scroll').pipe(
            map(_ => el.getBoundingClientRect().top),
            debounceTime(100),
            takeUntil(this.toDestory$),
            tap(offset => {

                if (offset <= 60) {
                    if (this.hideStickyDone) {
                        this.renderer.removeClass(el, 'sticky-header-hide');
                        this.renderer.addClass(el, 'sticky-header-show');
                    }
                    this.renderer.removeClass(el, 'sticky-header-shadow-inactive');
                    this.renderer.addClass(el, 'sticky-header-shadow-active');
                }
            }),
            filter(offset => offset > 61),
            debounceTime(70))
            .subscribe(_ => {
                this.renderer.removeClass(el, 'sticky-header-shadow-active');
                this.renderer.addClass(el, 'sticky-header-shadow-inactive');

                if (this.hideStickyDone) {
                    this.renderer.removeClass(el, 'sticky-header-show');
                    this.renderer.addClass(el, 'sticky-header-hide');
                }
            });
    }
}
